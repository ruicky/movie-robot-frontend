import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../../utils/request";

import {Alert as MuiAlert, Button, TextField as MuiTextField} from "@mui/material";
import {spacing} from "@mui/system";
import useAuth from "../../../hooks/useAuth";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);

function AdminUserConfigForm({}) {
    const {signIn} = useAuth();
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const saveWebConfig = async (username, password) => {
        const res = await axios.post("/api/config/init_admin", {username, password});
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            throw new Error(message);
        }
        await signIn(username, password);
        navigate(data.next)
        setMessage("管理账号初始化成功");
    };
    const formik = useFormik({
        initialValues: {
            username: "admin", password: "", confirmPassword: ""
        }, validationSchema: Yup.object().shape({
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
                await saveWebConfig(values.username, values.confirmPassword);
            } catch (error) {
                const message = error.message || "配置出错啦";

                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        {message && (<Alert severity="success" my={3}>
            {message}
        </Alert>)}
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
            创建进入下一步
        </Button>
    </form>);
}

export default AdminUserConfigForm;
