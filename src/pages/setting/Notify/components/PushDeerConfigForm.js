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

function PushDeerConfigForm({data, onSubmitEvent, onTestEvent}) {
    const navigate = useNavigate();
    const [opType, setOpType] = useState('save')
    const [message, setMessage] = useState();
    const formik = useFormik({
        initialValues: {
            name:'',
            api: 'https://api2.pushdeer.com/message/push',
            pushkey: '',
            enable: true
        }, validationSchema: Yup.object().shape({
            name: Yup.string().max(1000).required(),
            api: Yup.string().max(1000).required(),
            pushkey: Yup.string().max(500).required()
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
            formik.setFieldValue('name', data.name)
            formik.setFieldValue('api', data.api)
            formik.setFieldValue('pushkey', data.pushkey)
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
            name="name"
            label="通道别名"
            value={formik.values.name}
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText={<>
                设置一个唯一的别名，方便被引用
            </>}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="api"
            label="推送API地址"
            value={formik.values.api}
            error={Boolean(formik.touched.api && formik.errors.api)}
            fullWidth
            helperText={'pushdeer的api地址，默认是官方，可以改为自建'}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="pushkey"
            label="pushkey"
            value={formik.values.pushkey}
            error={Boolean(formik.touched.pushkey && formik.errors.pushkey)}
            fullWidth
            helperText={'推送接口的pushkey'}
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

export default PushDeerConfigForm;
