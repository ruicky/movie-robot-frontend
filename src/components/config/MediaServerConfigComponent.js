import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../utils/request";

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

function MediaServerConfigComponent({isInit}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const saveConfig = async (type, url, token) => {
        const res = await axios.post("/api/config/save_media_server", {type, url, token});
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            throw new Error(message);
        }
        if (isInit) {
            navigate("/setup/" + data.next);
        } else {
            setMessage(message);
        }
    };
    const formik = useFormik({
        initialValues: {
            type: "emby",
            url: "http://",
            token: ""
        }, validationSchema: Yup.object().shape({
            url: Yup.string().max(256).required(),
            token: Yup.string().max(256).required()
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                await saveConfig(values.type, values.url, values.token);
            } catch (error) {
                const message = error.message || "配置出错啦";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        await axios.get("/api/config/get_media_server").then((res) => {
            const data = res.data;
            formik.setFieldValue("type", data.type);
            formik.setFieldValue("url", data.url);
            formik.setFieldValue("token", data.token);
        });
    }, []);
    let tokenHelpText, tokenLabel;
    if (formik.values.type == "emby") {
        tokenLabel = "API密钥";
        tokenHelpText = (
            <span>
                访问Emby接口查询数据时所用的密钥
                {formik.values.url &&
                    <Link target="_blank"
                          href={formik.values.url + "/web/index.html#!/apikeys"}>
                        去申请API密钥
                    </Link>}
            </span>
        );
    } else {
        tokenLabel = "Token";
        tokenHelpText = (
            <span>
                用于访问Plex接口的Token
                <Link target="_blank"
                      href="https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/">
                    学习如何获取
                </Link>
            </span>
        );
    }
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
                <MenuItem value="emby">Emby</MenuItem>
                <MenuItem value="plex">Plex</MenuItem>
            </Select>
            <FormHelperText>媒体服务类型</FormHelperText>
        </FormControl>
        <TextField
            type="text"
            name="url"
            label="访问地址"
            value={formik.values.url}
            error={Boolean(formik.touched.url && formik.errors.url)}
            fullWidth
            helperText="Emby网站服务的访问地址，带协议类型和端口号"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="token"
            label={tokenLabel}
            value={formik.values.token}
            error={Boolean(formik.touched.token && formik.errors.token)}
            fullWidth
            helperText={tokenHelpText}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <Centered>
            {isInit && (<Button sx={{mr: 2}}
                                size="medium"
                                variant="contained"
                                color="primary"
                                onClick={() => {
                                    navigate("/setup/web");
                                }}
            >
                返回网站访问设置
            </Button>)}
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
            >
                {isInit ? "保存进入下一步" : "保存"}
            </Button>
        </Centered>

    </form>);
}

export default MediaServerConfigComponent;
