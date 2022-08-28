import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";

import {Alert as MuiAlert, Button, Checkbox, FormControlLabel, TextField as MuiTextField} from "@mui/material";
import {spacing} from "@mui/system";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function TelegramConfigForm({data, onSubmitEvent, onTestEvent}) {
    const navigate = useNavigate();
    const [opType, setOpType] = useState('save')
    const [message, setMessage] = useState();
    const formik = useFormik({
        initialValues: {
            server_url: 'https://api.telegram.org',
            token: '',
            user_id: '',
            proxy: '',
            enable: true
        }, validationSchema: Yup.object().shape({
            server_url: Yup.string().max(1000).required(),
            token: Yup.string().max(500).required(),
            user_id: Yup.string().max(500).required(),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                setMessage(undefined)
                setSubmitting(true)
                let params = {...values}
                if (opType === "save") {
                    await onSubmitEvent(params, setMessage)
                } else if (opType === "test") {
                    await onTestEvent(params, setMessage)
                }
            } catch (error) {
                const message = error.message || "PushDeer配置出错啦";
                setStatus({success: false});
                setErrors({submit: message});
            } finally {
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        if (data !== undefined && data !== null) {
            formik.setFieldValue('server_url', data?.server_url ? data.server_url : 'https://api.telegram.org');
            formik.setFieldValue('token', data?.token);
            formik.setFieldValue('user_id', data?.user_id);
            formik.setFieldValue('proxy', data?.proxy);
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
            name="server_url"
            label="推送API地址"
            value={formik.values.server_url}
            error={Boolean(formik.touched.server_url && formik.errors.server_url)}
            fullWidth
            helperText={'telegram的api服务地址，默认是官方，可以改为自建'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="token"
            label="token"
            value={formik.values.token}
            error={Boolean(formik.touched.token && formik.errors.token)}
            fullWidth
            helperText={'访问接口的Token，BotFather获取到的'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="user_id"
            label="userID"
            value={formik.values.user_id}
            error={Boolean(formik.touched.user_id && formik.errors.user_id)}
            fullWidth
            helperText={'getuserID /start 获取到的一个数字编号'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="proxy"
            label="代理设置"
            value={formik.values.proxy}
            error={Boolean(formik.touched.proxy && formik.errors.proxy)}
            fullWidth
            helperText={(
                <span>
                    留空则不使用代理。支持通过HTTP代理、SOCKS代理发送消息。示范：http://localhost:8030 或 socks5://user:pass@host:port
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
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
                    onClick={() => setOpType('test')}
                    disabled={formik.isSubmitting}
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

export default TelegramConfigForm;
