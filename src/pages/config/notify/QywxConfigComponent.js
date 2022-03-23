import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../../utils/request";

import {
    Alert as MuiAlert,
    Button,
    FormControl,
    FormHelperText,
    Link,
    MenuItem,
    Select,
    TextField as MuiTextField
} from "@mui/material";
import {spacing} from "@mui/system";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function QywxConfigComponent({isInit, data}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const formik = useFormik({
        initialValues: {
            touser: '@all',
            corpid: '',
            corpsecret: '',
            agentid: '100001',
            movie_message_pattern: '${nickname}添加的电影 ${name}(${year})下载完毕',
            tv_message_pattern: '${nickname}添加的剧集 ${name}(${year})第${episodes}集下载完毕'
        }, validationSchema: Yup.object().shape({
            tmdb_api_key: Yup.string().max(256).required(),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                // await saveConfig(values);
            } catch (error) {
                const message = error.message || "配置出错啦";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        if (data !== undefined && data !== null) {
            formik.setFieldValue('push_url', data.defualt_push_url)
            formik.setFieldValue('sound', data.sound)
            formik.setFieldValue('group', data.group)
            formik.setFieldValue('movie_message_pattern', data.movie_message_pattern)
        }
    }, []);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        {message && (<Alert severity="success" my={3}>
            {message}
        </Alert>)}
        <TextField
            type="text"
            name="touser"
            label="touser"
            value={formik.values.touser}
            error={Boolean(formik.touched.touser && formik.errors.touser)}
            fullWidth
            helperText={'指定接收消息的成员，成员ID列表（多个接收者用‘|’分隔，最多支持1000个）。特殊情况：指定为"@all"，则向该企业应用的全部成员发送'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="corpid"
            label="corpid"
            value={formik.values.corpid}
            error={Boolean(formik.touched.corpid && formik.errors.corpid)}
            fullWidth
            helperText={'企业微信CorpID'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="corpsecret"
            label="corpsecret"
            value={formik.values.corpsecret}
            error={Boolean(formik.touched.corpsecret && formik.errors.corpsecret)}
            fullWidth
            helperText={'企业微信corpsecret'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="agentid"
            label="agentid"
            value={formik.values.agentid}
            error={Boolean(formik.touched.agentid && formik.errors.agentid)}
            fullWidth
            helperText={'企业应用的id，整型。企业内部开发，可在应用的设置页面查看；'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            name="movie_message_pattern"
            label="电影通知模版"
            value={formik.values.movie_message_pattern}
            error={Boolean(formik.touched.movie_message_pattern && formik.errors.movie_message_pattern)}
            fullWidth
            helperText={'电影下载完成时，最终推送到app的消息内容，可以使用占位变量自由定义格式。'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            maxRows={4}
            my={3}
        />
        <TextField
            name="tv_message_pattern"
            label="剧集通知模版"
            value={formik.values.tv_message_pattern}
            error={Boolean(formik.touched.tv_message_pattern && formik.errors.tv_message_pattern)}
            fullWidth
            helperText={'剧集下载完成时，最终推送到app的消息内容，可以使用占位变量自由定义格式。'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            multiline
            maxRows={4}
            my={3}
        />
        <Centered>
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth={!isInit}
            >
                保存设置
            </Button>
        </Centered>

    </form>);
}

export default QywxConfigComponent;
