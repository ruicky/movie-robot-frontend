import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../../utils/request";

import {
    Alert as MuiAlert,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
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

function DownloadCLientConfigComponent({isInit}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const saveConfig = async (params) => {
        const res = await axios.post("/api/config/save_download_client", params);
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            throw new Error(message);
        }
        if (isInit) {
            navigate(data.next);
        } else {
            setMessage(message);
        }
    };
    const formik = useFormik({
        initialValues: {
            type: "qbittorrent", url: "http://", username: "", password: "", need_login: true
        }, validationSchema: Yup.object().shape({
            url: Yup.string().max(256).required("访问地址不能为空"),
            username: Yup.string().when("need_login", {
                is: true,
                then: Yup.string().max(256).required("登陆账号不能为空")
            }),
            password: Yup.string().when("need_login", {
                is: true,
                then: Yup.string().max(256).required("登陆密码不能为空")
            })
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                await saveConfig({
                    type: values.type,
                    url: values.url,
                    username: values.username,
                    password: values.password,
                    need_login: values.need_login
                });
            } catch (error) {
                const message = error.message || "配置出错啦";

                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        axios.get("/api/config/get_download_client").then((res) => {
            const data = res.data;
            if (data != undefined) {
                if (data.type !== undefined && data.type !== null) {
                    formik.setFieldValue("type", data.type);
                }
                if (data.url !== undefined && data.url !== null) {
                    formik.setFieldValue("url", data.url);
                }
                if (data.username !== undefined && data.username !== null) {
                    formik.setFieldValue("username", data.username);
                }
                if (data.password !== undefined && data.password !== null) {
                    formik.setFieldValue("password", data.password);
                }
                if (data.need_login !== undefined && data.need_login !== null) {
                    formik.setFieldValue("need_login", data.need_login);
                }
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

        <FormControl m={4} fullWidth>
            <Select
                name="type"
                value={formik.values.type}
                onChange={(e) => {
                    formik.handleChange(e);
                }}
                displayEmpty
            >
                <MenuItem value="qbittorrent">qbittorrent</MenuItem>
                <MenuItem value="transmission">transmission</MenuItem>
            </Select>
            <FormHelperText>目前已支持的下载工具</FormHelperText>
        </FormControl>
        <TextField
            type="text"
            name="url"
            label="访问地址"
            value={formik.values.url}
            error={Boolean(formik.touched.url && formik.errors.url)}
            fullWidth
            helperText="网站服务的访问地址，带协议类型和端口号"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="username"
            label={"登陆账号"}
            value={formik.values.username}
            error={Boolean(formik.touched.username && formik.errors.username)}
            fullWidth
            helperText={(formik.touched.username && formik.errors.username) || "用于登陆的管理账号"}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="password"
            label={"登陆密码"}
            value={formik.values.password}
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={(formik.touched.password && formik.errors.password) || "用于登陆的密码"}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        {formik.values.type == "qbittorrent" && <FormControlLabel
            control={<Checkbox
                checked={formik.values.need_login}
                onChange={formik.handleChange}
                name="need_login"
            />}
            label="需要登陆(没配置内网免登必须勾选)"
        />}
        <Centered>
            {isInit && (<Button sx={{mr: 2}}
                                size="medium"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    navigate("/setup/media-server");
                                }}
            >
                返回下载工具设置
            </Button>)}
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth={!isInit}
            >
                {isInit ? "保存进入下一步" : "保存"}
            </Button>
        </Centered>

    </form>);
}

export default DownloadCLientConfigComponent;
