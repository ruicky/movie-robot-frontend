import {Button, Card, CardActions, CardContent, Grid, Link, TextField, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";

const UserConfigComponent = ({users, setUsers, submitting, setHasError}) => {
    const [errors, setErrors] = useState({})
    const handleOnChange = (index, e) => {
        let tmp = [...users];
        let item = {...tmp[index]};
        item[e.target.name] = e.target.value;
        tmp[index] = item;
        setUsers(tmp);
    };
    const helperText = (i, name) => {
        let key = name + i;
        return errors[key] !== undefined && errors[key]
    };
    const error = (i, name) => {
        let key = name + i;
        return errors[key] !== undefined && errors[key] !== ''
    };
    const handleOnBlur = async (index, e) => {
        if (e.target.value === '') {
            let tmpErrors = {...errors}
            tmpErrors[e.target.name + index] = '值不能为空'
            setErrors(tmpErrors)
        } else {
            let tmpErrors = {...errors}
            delete tmpErrors[e.target.name + index]
            setErrors(tmpErrors)
        }
    }
    useEffect(() => {
        if (submitting) {
            let tmpErrors = {...errors};
            let hasError = false;
            for (let i = 0; i < users.length; i++) {
                let u = users[i];
                for (let k of Object.keys(u)) {
                    if (u[k] === undefined || u[k] === '') {
                        tmpErrors[k + i] = '值不能为空'
                        hasError = true;
                    }
                }
            }
            setHasError(hasError)
            setErrors(tmpErrors)
        }
    }, [submitting])
    return (<React.Fragment>
        <Card>
            {users.map((user, i) => (<Card mb={6} key={i}>
                <Typography gutterBottom variant="h5" component="h2">
                    监听用户 {user.id}
                    <Button
                        onClick={() => {
                            const temp = [...users];
                            temp.splice(i, 1);
                            setUsers(temp);
                        }}
                    >
                        删除
                    </Button>
                </Typography>
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid item md={6}>
                            <TextField
                                name="id"
                                label="豆瓣ID"
                                fullWidth
                                variant="outlined"
                                error={error(i, 'id')}
                                helperText={helperText(i, 'id') || (<span>
                                        获取豆瓣电影想看信息的关键要素
                                        <Link target="_blank"
                                              href="https://accounts.douban.com/passport/setting">
                                                去查找
                                            </Link>
                                    </span>)}
                                value={user.id}
                                onChange={(e) => handleOnChange(i, e)}
                                onBlur={(e) => handleOnBlur(i, e)}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                type="number"
                                name="pull_time_range"
                                label="拉取天数"
                                fullWidth
                                variant="outlined"
                                error={error(i, 'pull_time_range')}
                                helperText={helperText(i, 'pull_time_range') || "最近N天加入的豆瓣想看的数据"}
                                value={user.pull_time_range}
                                onChange={(e) => handleOnChange(i, e)}
                                onBlur={(e) => handleOnBlur(i, e)}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>))}
            <CardActions>
                <Button size="small" color="primary" onClick={() => {
                    setUsers([...users, {id: '', pull_time_range: 365}]);
                }}>
                    加一个用户
                </Button>
            </CardActions>
        </Card>
    </React.Fragment>)
}
export default UserConfigComponent