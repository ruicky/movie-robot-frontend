import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../utils/request";

import {
    Alert as MuiAlert, Button, TextField as MuiTextField
} from "@mui/material";
import {spacing} from "@mui/system";
import {setSession} from "@/utils/jwt";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

function WebConfigComponent({isInit}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const saveWebConfig = async (port, username, password, server_url) => {
        const res = await axios.post("/api/config/save_web", {port, username, password, server_url});
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            throw new Error(message);
        }
        if (data.access_token !== undefined && data.access_token !== null) {
            setSession(data.access_token)
        }
        if (isInit) {
            navigate(data.next);
        } else {
            setMessage("设置保存成功，但此页面设置需要重启后才生效。");
        }
    };
    const formik = useFormik({
        initialValues: {
            port: 1329, username: "admin", password: "", confirmPassword: "", server_url: "http://"
        }, validationSchema: Yup.object().shape({
            port: Yup.string().max(5).required("网站服务端口号必须填写"),
            username: Yup.string().max(64).required("网站登陆账号必须填写"),
            password: Yup.string()
                .min(8, "登陆密码不能少于8位")
                .max(64)
                .required("网站登陆密码必须填写"),
            confirmPassword: Yup.string().when("password", {
                is: (val) => (val && val.length > 0 ? true : false),
                then: Yup.string().oneOf([Yup.ref("password")], "两次输入的密码必须一致")
            })
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                await saveWebConfig(values.port, values.username, values.confirmPassword, values.server_url);
            } catch (error) {
                const message = error.message || "配置出错啦";

                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        axios.get("/api/config/get_web").then((res) => {
            const data = res.data;
            if (data != undefined) {
                formik.setFieldValue("server_url", data.server_url);
                formik.setFieldValue("port", data.port);
                formik.setFieldValue("username", data.username);
                formik.setFieldValue("password", data.password);
                formik.setFieldValue("confirmPassword", data.password);
            }
        });
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
            name="server_url"
            label="站点访问地址"
            value={formik.values.server_url}
            error={Boolean(formik.touched.server_url && formik.errors.server_url)}
            fullWidth
            helperText="该地址适用于未来分享应用链接时访问，一般为外网可访问的地址"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="port"
            label="网站访问端口"
            value={formik.values.port}
            error={Boolean(formik.touched.port && formik.errors.port)}
            fullWidth
            helperText={(formik.touched.port && formik.errors.port) || "此端口需映射到Docker容器后才可以访问"}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="username"
            label="网站登陆账号"
            value={formik.values.username}
            error={Boolean(formik.touched.username && formik.errors.username)}
            fullWidth
            helperText={formik.touched.username && formik.errors.username}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="password"
            name="password"
            label="登陆密码"
            value={formik.values.password}
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={formik.touched.password && formik.errors.password}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="password"
            name="confirmPassword"
            label="确认密码"
            value={formik.values.confirmPassword}
            error={Boolean(formik.touched.confirmPassword && formik.errors.confirmPassword)}
            fullWidth
            helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={formik.isSubmitting}
            fullWidth
        >
            {isInit ? "保存进入下一步" : "保存"}
        </Button>
    </form>);
}

export default WebConfigComponent;
