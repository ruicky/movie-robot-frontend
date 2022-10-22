import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Button,
    Checkbox,
    Divider as MuiDivider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Link,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import {useGetNotifyTemplate, useSaveNotifyTemplate} from "@/api/SettingApi";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

function EditForm({}) {
    const navigate = useNavigate();
    const [selectTemplate, setSelectTemplate] = useState(null)
    const [templates, setTemplates] = useState([]);
    const {data: notifyTemplate, isLoading} = useGetNotifyTemplate();
    const {mutateAsync: save, isSaving} = useSaveNotifyTemplate();
    useEffect(() => {
        if (notifyTemplate?.data) {
            setTemplates(notifyTemplate.data);
        }
    }, [notifyTemplate])
    const onSave = () => {
        save(templates, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success('通知模版保存成功，已经生效了。')
                    navigate("/setting/index");
                } else {
                    message.error(msg)
                }
            }
        });
    }
    return (<>
        <FormControl m={4} fullWidth>
            <Select
                name="message_template"
                value={selectTemplate}
                onChange={(e) => {
                    setSelectTemplate(e.target.value);
                }}
            >
                {templates && Object.keys(templates).map((key) => (
                    <MenuItem
                        value={key}>{`[${templates[key].enable ? "启用通知" : "关闭通知"}]${templates[key].name}`}</MenuItem>
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
        <TextField
            type="text"
            name="title"
            value={selectTemplate && templates[selectTemplate]?.title}
            onChange={(e) => {
                const tmp = {...templates};
                tmp[selectTemplate].title = e.target.value;
                setTemplates(tmp);
            }}
            fullWidth
            helperText={'最终推送到app的消息标题'}
            my={3}
        />
        <TextField
            name="message"
            value={selectTemplate && templates[selectTemplate]?.body}
            onChange={(e) => {
                const tmp = {...templates};
                tmp[selectTemplate].body = e.target.value;
                setTemplates(tmp);
            }}
            fullWidth
            helperText={'最终推送到app的消息内容'}
            multiline
            maxRows={4}
            my={3}
        />
        <FormControlLabel
            control={<Checkbox
                checked={selectTemplate && templates[selectTemplate]?.enable}
                onChange={(e) => {
                    const tmp = {...templates};
                    tmp[selectTemplate].enable = e.target.checked;
                    setTemplates(tmp);
                }}
                name="enable"
            />}
            label="开启这条推送，取消后此类通知将不再推送"
        />
        <Box justifyContent={"center"}>
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
        <Divider my={4}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditNotifyTemplate;