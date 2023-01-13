import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Button,
    Divider as MuiDivider,
    FormControl,
    FormHelperText,
    Grid,
    Link,
    MenuItem,
    Select,
    Tab,
    TextField,
    Typography
} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import {useGetNotifyTemplate, useSaveNotifyTemplate} from "@/api/SettingApi";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import message from "@/utils/message";
import {TabContext, TabList, TabPanel} from "@mui/lab";

const Divider = styled(MuiDivider)(spacing);

function EditForm({}) {
    const navigate = useNavigate();
    const [selectTemplate, setSelectTemplate] = useState({})
    const [templates, setTemplates] = useState([]);
    const {data: notifyTemplate, isLoading} = useGetNotifyTemplate();
    const {mutateAsync: save, isSaving} = useSaveNotifyTemplate();
    const [selectTab, setSelectTab] = React.useState('qywx');
    useEffect(() => {
        if (notifyTemplate?.data) {
            const select = {}
            notifyTemplate.data.forEach((item) => {
                select[item.channel_type] = Object.keys(item).filter(key => !['name', 'channel_type'].includes(key))[0];
            })
            setTemplates(notifyTemplate.data);
            setSelectTemplate(select);
        }
    }, [notifyTemplate])
    const onSave = () => {
        save(templates, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success('通知模版保存成功，已经生效了。')
                } else {
                    message.error(msg)
                }
            }
        });
    }
    return (<>
        <TabContext value={selectTab}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList onChange={(e, val) => setSelectTab(val)}>
                    {templates && templates.map((item) => <Tab label={item.name} value={item.channel_type}/>)}
                </TabList>
            </Box>
            {templates && templates.map((item) => <TabPanel value={item.channel_type}>
                <Grid container>
                    <Grid xs={12} item>
                        <FormControl m={4} fullWidth>
                            <Select
                                name="message_template"
                                value={selectTemplate[item.channel_type]}
                                onChange={(e) => {
                                    const tmp = {...selectTemplate};
                                    tmp[item.channel_type] = e.target.value;
                                    setSelectTemplate(tmp);
                                }}
                            >
                                {templates && Object.keys(item).filter(key => !['name', 'channel_type'].includes(key)).map((key) => (
                                    <MenuItem
                                        value={key}>{item[key].name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                选择推送模版，当前系统可以发送推送的功能点，都包含在此
                                <Link target="_blank"
                                      href="https://yee329.notion.site/5007729e854e4541af84ea31c4bf648a">
                                    学习如何配置
                                </Link>
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} item>
                        <TextField
                            type="text"
                            name="title"
                            value={selectTemplate[item.channel_type] && item[selectTemplate[item.channel_type]]?.title}
                            onChange={(e) => {
                                const tmp = [...templates];
                                for (const x of tmp) {
                                    if (x.channel_type === item.channel_type) {
                                        x[selectTemplate[item.channel_type]].title = e.target.value;
                                        break;
                                    }
                                }
                                setTemplates(tmp);
                            }}
                            fullWidth
                            helperText={'推送时的标题模版'}
                            my={3}
                        />
                    </Grid>
                    <Grid xs={12} item>
                        <TextField
                            name="message"
                            value={selectTemplate[item.channel_type] && item[selectTemplate[item.channel_type]]?.body}
                            onChange={(e) => {
                                const tmp = [...templates];
                                for (const x of tmp) {
                                    if (x.channel_type === item.channel_type) {
                                        x[selectTemplate[item.channel_type]].body = e.target.value;
                                        break
                                    }
                                }
                                setTemplates(tmp);
                            }}
                            fullWidth
                            helperText={'推送时的内容模版'}
                            multiline
                            maxRows={30}
                            my={3}
                        />
                    </Grid>
                </Grid>
            </TabPanel>)}
        </TabContext>
        <Box mt={2} justifyContent={"center"}>
            <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={onSave}
                disabled={isSaving}
                fullWidth
            >
                保存
            </Button>
        </Box>
    </>);
}

const EditNotifyTemplate = () => {
    return (<React.Fragment>
        <Helmet title="通知模版设置"/>
        <Typography variant="h3" gutterBottom display="inline">
            通知模版设置
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>通知模版设置</Typography>
        </Breadcrumbs>
        <Divider my={2}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditNotifyTemplate;