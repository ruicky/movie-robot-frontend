import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import _ from 'lodash';

import {Alert as MuiAlert, Button, Checkbox, FormControlLabel, TextField as MuiTextField} from "@mui/material";
import {spacing} from "@mui/system";
import MessageTemplateComponent from "@/pages/config/notify/MessageTemplateComponent";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function BarkConfigComponent({isInit, data, onSubmitEvent, onTestEvent}) {
    const navigate = useNavigate();
    const [opType, setOpType] = useState('save')
    const [message, setMessage] = useState();
    const [messageTemplate, setMessageTemplate] = useState({
        movie_completed: {
            title: '${name} (${year}) 评分:${rating}', message: '${nickname}添加的电影 ${name}(${year})下载完毕'
        }, 'tv_completed': {
            title: '${name} (${year}) 评分:${rating}', message: '${nickname}添加的剧集 ${name}(${year})第${episodes}集下载完毕'
        }
    })
    const formik = useFormik({
        initialValues: {
            push_url: '',
            sound: 'chime',
            group: '电影机器人',
            icon: 'https://yee-1254270141.cos.ap-beijing.myqcloud.com/movie_robot/icon.jpg',
            message_template: 'movie_completed',
            title: '${name} (${year}) 评分:${rating}',
            message: '${nickname}添加的电影 ${name}(${year})下载完毕',
            enable: true
        }, validationSchema: Yup.object().shape({
            push_url: Yup.string().max(1000).required(),
            sound: Yup.string().max(256).required(),
            group: Yup.string().max(256).required(),
            title: Yup.string().max(1000).required(),
            message: Yup.string().max(1000).required(),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                setMessage(undefined)
                setSubmitting(true)
                let params = {...values}
                params['message_template'] = messageTemplate;
                delete params['title']
                delete params['message']
                if (opType === "save") {
                    await onSubmitEvent(params, setMessage)
                } else if (opType === "test") {
                    await onTestEvent(params, setMessage)
                }
            } catch (error) {
                const message = error.message || "Bark配置出错啦";
                setStatus({success: false});
                setErrors({submit: message});
            } finally {
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        if (data !== undefined && data !== null) {
            formik.setFieldValue('push_url', data.push_url)
            formik.setFieldValue('sound', data.sound)
            formik.setFieldValue('group', data.group)
            if (data.icon) {
                formik.setFieldValue('icon', data.icon)
            }
            const {
                title,
                message
            } = _.get(data, `message_template.${_.get(formik, 'values.message_template', '')}`, {
                title: '',
                message: ''
            })
            formik.setFieldValue('title', title)
            formik.setFieldValue('message', message)
            setMessageTemplate(data.message_template)
            if (data.enable !== undefined || data.enable !== null) {
                formik.setFieldValue('enable', data.enable)
            }
        }
    }, [data]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        {message && (<Alert severity="success" my={3}>
            {message}
        </Alert>)}
        <TextField
            type="text"
            name="push_url"
            label="默认推送URL"
            value={formik.values.push_url}
            error={Boolean(formik.touched.push_url && formik.errors.push_url)}
            fullWidth
            helperText={'Bark App中获得的推送URL'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="sound"
            label="sound"
            value={formik.values.sound}
            error={Boolean(formik.touched.sound && formik.errors.sound)}
            fullWidth
            helperText={'Bark 推送接口的sound参数'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="group"
            label="group"
            value={formik.values.group}
            error={Boolean(formik.touched.group && formik.errors.group)}
            fullWidth
            helperText={'对消息进行分组，推送将按group分组显示在通知中心中。'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="icon"
            label="icon"
            value={formik.values.icon}
            error={Boolean(formik.touched.icon && formik.errors.icon)}
            fullWidth
            helperText={'自定义推送图标（需IOS15或以上）'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <MessageTemplateComponent formik={formik} messageTemplate={messageTemplate}
                                  setMessageTemplate={setMessageTemplate}/>
        <FormControlLabel
            control={<Checkbox
                checked={formik.values.enable}
                name="enable"
                onChange={formik.handleChange}
            />}
            label="启用这个通知（启用多个将推多个）"
        />
        <Centered>
            <Button sx={{mr: 2}}
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                    onClick={() => setOpType('test')}

            >
                推送一条消息测试
            </Button>
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                onClick={() => setOpType('save')}
            >
                保存设置
            </Button>
        </Centered>

    </form>);
}

export default BarkConfigComponent;
