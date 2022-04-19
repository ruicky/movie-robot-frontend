import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../../utils/request";

import {Alert as MuiAlert, Button, Link, TextField as MuiTextField} from "@mui/material";
import {spacing} from "@mui/system";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function MovieMetadataConfigComponent({isInit}) {
    const navigate = useNavigate();
    const [message, setMessage] = useState();
    const saveConfig = async (params) => {
        const res = await axios.post("/api/config/save_movie_metadata", params);
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
            tmdb_api_key: '',
            fanart_api_key: '',
            proxies: ''
        }, validationSchema: Yup.object().shape({
            tmdb_api_key: Yup.string().max(256).required(),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                setMessage(null);
                await saveConfig(values);
            } catch (error) {
                const message = error.message || "配置出错啦，容器能科学上网么？";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        await axios.get("/api/config/get_movie_metadata").then((res) => {
            const data = res.data;
            if (data !== undefined && data !== null) {
                formik.setFieldValue("tmdb_api_key", data.tmdb_api_key);
                formik.setFieldValue("fanart_api_key", data.fanart_api_key);
                if (data.proxies) {
                    formik.setFieldValue("proxies", data.proxies)
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
        <TextField
            type="text"
            name="tmdb_api_key"
            label="TMDB API密钥"
            value={formik.values.tmdb_api_key}
            error={Boolean(formik.touched.tmdb_api_key && formik.errors.tmdb_api_key)}
            fullWidth
            helperText={(
                <span>
                    访问TMDB接口时需要的API密钥
                    <Link target="_blank"
                          href="https://www.themoviedb.org/settings/api">
                            去申请API密钥
                        </Link>
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="fanart_api_key"
            label="FanArt API密钥"
            value={formik.values.fanart_api_key}
            error={Boolean(formik.touched.fanart_api_key && formik.errors.fanart_api_key)}
            fullWidth
            helperText={(
                <span>
                    可为空，配置后推送和页面显示的图片会更好看。
                    <Link target="_blank"
                          href="https://fanart.tv/get-an-api-key/">
                            去申请API密钥
                        </Link>
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="proxies"
            label="代理设置"
            value={formik.values.proxies}
            error={Boolean(formik.touched.proxies && formik.errors.proxies)}
            fullWidth
            helperText={(
                <span>
                    留空则不使用代理。支持通过HTTP代理、SOCKS代理访问TMDB和FanArt。示范：http://localhost:8030 或 socks5://user:pass@host:port
                </span>
            )}
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
                                    navigate("/setup/media-path");
                                }}
            >
                返回媒体路径设置
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

export default MovieMetadataConfigComponent;
