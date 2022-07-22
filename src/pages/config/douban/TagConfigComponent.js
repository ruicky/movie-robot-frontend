import {Button, Card, CardActions, CardContent, Grid, Link, TextField, Typography} from "@mui/material";
import React, {useState} from "react";
import ScoreRuleSelectComponent from "@/components/core/ScoreRuleSelectComponent";

const TagConfigComponent = ({ruleData, tags, setTags}) => {
    const [errors, setErrors] = useState({})
    const handleOnChange = (index, e) => {
        let tmp = [...tags];
        let item = {...tmp[index]};
        item[e.target.name] = e.target.value;
        tmp[index] = item;
        setTags(tmp);
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
        if (e.target.name === 'tag_name' || e.target.name === 'score_rule') {
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
    }
    return (
        <React.Fragment>
            <Card sx={{mt:4}}>
                {tags.map((tag, i) => (
                    <Card mb={6} key={i}>
                        <Typography gutterBottom variant="h5" component="h2" ml={4} mt={2}>
                            标签 {tag.tag_name}
                            <Button
                                onClick={() => {
                                    const temp = [...tags];
                                    temp.splice(i, 1);
                                    setTags(temp);
                                }}
                            >
                                删除
                            </Button>
                        </Typography>
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid item md={6}>
                                    <TextField
                                        name="tag_name"
                                        label="标签名"
                                        fullWidth
                                        variant="outlined"
                                        error={error(i, 'tag_name')}
                                        helperText={helperText(i, 'tag_name') || "在豆瓣点想看时，可以打上一个标签名"}
                                        value={tag.tag_name}
                                        onChange={(e) => handleOnChange(i, e)}
                                        onBlur={(e) => handleOnBlur(i, e)}
                                    />
                                </Grid>
                                <Grid item md={6}>
                                    <ScoreRuleSelectComponent name='score_rule' value={tag.score_rule} data={ruleData}
                                                              onChange={(e) => handleOnChange(i, e)}/>
                                </Grid>
                                <Grid item md={12}>
                                    <TextField
                                        name="name_keyword"
                                        label="加权关键字"
                                        fullWidth
                                        variant="outlined"
                                        error={error(i, 'name_keyword')}
                                        helperText={helperText(i, 'name_keyword') || "相同品质的资源，包含此关键字的种子，将会被优先下载。多个用英文逗号,隔开"}
                                        value={tag.name_keyword}
                                        onChange={(e) => handleOnChange(i, e)}
                                        onBlur={(e) => handleOnBlur(i, e)}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                ))}
                <CardActions>
                    <Button size="small" color="primary" onClick={() => {
                        setTags([...tags, {tag_name: '', name_keyword: '', score_rule: 'compress'}]);
                    }}>
                        加一个标签选种配置
                    </Button>
                </CardActions>
            </Card>
        </React.Fragment>
    )
}
export default TagConfigComponent