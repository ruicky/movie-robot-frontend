import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";

import {
    Alert as MuiAlert,
    Button,
    FormControl,
    FormHelperText,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import {spacing} from "@mui/system";
import {useNavigate, useSearchParams} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {getUser, getUserOptions, registerUser, updateUser} from "@/api/UserApi";
import message from "@/utils/message";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;
const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function EditUser({}) {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [qywxUserList, setQywxUserList] = useState([])
    const [doubanUserList, setDoubanUserList] = useState([])
    const op = searchParams.get("op") || "add";
    const id = searchParams.get('id');
    const formik = useFormik({
        initialValues: {
            username: '',
            nickname: '',
            password: '',
            role: 2,
            qywxUser: '',
            doubanUser: '',
            pushdeerKey: '',
            barkUrl: ''

        }, validationSchema: Yup.object().shape({
            username: Yup.string().max(64, "用户名太长了").required("用户名不能为空"),
            nickname: Yup.string().max(64, "昵称太长了").required("昵称不能为空"),
            password: Yup.lazy((value => {
                if (op === "add") {
                    return Yup.string().min(6, "密码不能小于6位").max(64, "密码太长了").required("密码不能为空");
                } else {
                    return Yup.string();
                }
            }))
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                setSubmitting(true)
                let r;
                if (op === "add") {
                    r = await registerUser(values.username, values.password, values.nickname, values.role, values.doubanUser, values.qywxUser, values.pushdeerKey, values.barkUrl)
                } else {
                    r = await updateUser(id, values.username, values.nickname, values.password, values.role, values.doubanUser, values.qywxUser, values.pushdeerKey, values.barkUrl)
                }
                if (r.code === 0) {
                    message.success(r.message)
                } else {
                    setErrors({submit: r.message});
                }
                navigate("/user/index")
            } catch (error) {
                const message = error.message || "编辑用户出错了";
                setStatus({success: false});
                setErrors({submit: message});
            } finally {
                setSubmitting(false);
            }
        }
    });
    useEffect(async () => {
        const userOptions = await getUserOptions();
        if (userOptions) {
            if (userOptions.qywx_user_list) {
                setQywxUserList(userOptions.qywx_user_list);
            }
            if (userOptions.douban_user_list) {
                setDoubanUserList(userOptions.douban_user_list);
            }
        }
        if (op === "edit") {
            const user = await getUser(id);
            if (!user) {
                return
            }
            if (user.username) {
                formik.setFieldValue("username", user.username)
            }
            if (user.nickname) {
                formik.setFieldValue("nickname", user.nickname)
            }
            if (user.douban_user) {
                formik.setFieldValue("doubanUser", user.douban_user)
            }
            if (user.role) {
                formik.setFieldValue("role", user.role)
            }
            if (user.qywx_user) {
                formik.setFieldValue("qywxUser", user.qywx_user)
            }
            if (user.pushdeer_key) {
                formik.setFieldValue("pushdeerKey", user.pushdeer_key)
            }
            if (user.bark_url) {
                formik.setFieldValue("barkUrl", user.bark_url)
            }
        }
    }, [op])
    return (<React.Fragment>
            <Wrapper>
                <Helmet title={op === "add" ? "添加用户" : "编辑用户"}/>

                <Typography component="h1" variant="h4" align="center" gutterBottom>
                    {op === "add" ? "添加用户" : "编辑用户"}
                </Typography>
                <Typography component="h2" variant="body1" align="center">
                    用户可以登陆网站，设置独立的用户配置
                </Typography>
                <form noValidate onSubmit={formik.handleSubmit}>
                    {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
                        {formik.errors.submit}
                    </Alert>)}
                    <TextField
                        type="text"
                        name="username"
                        label="用户名"
                        value={formik.values.username}
                        error={Boolean(formik.touched.username && formik.errors.username)}
                        fullWidth
                        helperText={formik.touched.username && formik.errors.username || (
                            <span>
                                用作登陆账号，不可重复
                            </span>
                        )} onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        my={3}
                    />
                    <TextField
                        type="text"
                        name="nickname"
                        label="昵称"
                        value={formik.values.nickname}
                        error={Boolean(formik.touched.nickname && formik.errors.nickname)}
                        fullWidth
                        helperText={formik.touched.nickname && formik.errors.nickname || (
                            <span>
                                留下昵称，便于部分场景展示
                            </span>
                        )} onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        my={3}
                    />
                    <TextField
                        type="text"
                        name="password"
                        label="密码"
                        value={formik.values.password}
                        error={Boolean(formik.touched.password && formik.errors.password)}
                        fullWidth
                        helperText={formik.touched.password && formik.errors.password || (
                            <span>
                                登陆密码
                            </span>
                        )} onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        my={3}
                    />
                    <FormControl m={4} fullWidth>
                        <Select
                            name="role"
                            value={formik.values.role}
                            onChange={formik.handleChange}
                            displayEmpty
                        >
                            <MenuItem value={1}>管理员</MenuItem>
                            <MenuItem value={2}>普通用户</MenuItem>
                        </Select>
                        <FormHelperText>不同用户拥有不同的权限</FormHelperText>
                    </FormControl>
                    <FormControl m={4} fullWidth>
                        {formik.values.doubanUser ? null : <InputLabel>豆瓣用户ID</InputLabel>}
                        <Select
                            name="doubanUser"
                            value={formik.values.doubanUser}
                            onChange={formik.handleChange}
                            displayEmpty
                        >
                            {doubanUserList.map((item) => (
                                <MenuItem key={item} value={item}>{item}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>在智能下载-豆瓣想看中监听用户后，可以回来选择绑定（可留空）</FormHelperText>
                    </FormControl>
                    <FormControl m={4} fullWidth>
                        {formik.values.qywxUser ? null : <InputLabel>企业微信用户</InputLabel>}
                        <Select
                            name="qywxUser"
                            value={formik.values.qywxUser}
                            onChange={formik.handleChange}
                            displayEmpty
                        >
                            {qywxUserList.map((row) => (
                                <MenuItem key={row.user} value={row.user}>{row.user}</MenuItem>
                            ))}
                        </Select>
                        <FormHelperText>在企业微信的应用中发送"绑定用户"后，可以回来选择绑定（可留空）</FormHelperText>
                    </FormControl>
                    <TextField
                        type="text"
                        name="pushdeerKey"
                        label="Pushdeer PushKey"
                        value={formik.values.pushdeerKey}
                        error={Boolean(formik.touched.pushdeerKey && formik.errors.pushdeerKey)}
                        fullWidth
                        helperText={formik.touched.pushdeerKey && formik.errors.pushdeerKey || (
                            <span>
                                推送Pushdeer的key，每个设备都是不同的，设置后可以定向推送（可留空）
                            </span>
                        )} onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
                        my={3}
                    />
                    <TextField
                        type="text"
                        name="barkUrl"
                        label="Bark推送URL"
                        value={formik.values.barkUrl}
                        error={Boolean(formik.touched.barkUrl && formik.errors.barkUrl)}
                        fullWidth
                        helperText={formik.touched.barkUrl && formik.errors.barkUrl || (
                            <span>
                                推送的Bark URL，每个设备都是不同的，设置后可以定向推送（可留空）
                            </span>
                        )} onBlur={formik.handleBlur}
                        onChange={formik.handleChange}
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
                        >
                            {op === "add" ? "添加" : "保存"}
                        </Button>
                    </Centered>

                </form>
            </Wrapper>
        </React.Fragment>
    );
}

export default EditUser;
