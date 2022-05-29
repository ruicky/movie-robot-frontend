import React, {useEffect} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Breadcrumbs,
    Button,
    Divider as MuiDivider,
    Link,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useGetMovieMetadata, useSaveTmdb} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function EditForm({}) {
    const navigate = useNavigate();
    const {mutateAsync: getMovieMetadata, isLoading} = useGetMovieMetadata();
    const {mutateAsync: saveTmdb, isSaving} = useSaveTmdb();

    const formik = useFormik({
        initialValues: {
            api_key: '',
            proxies: ''
        }, validationSchema: Yup.object().shape({
            api_key: Yup.string().max(256).required(),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                saveTmdb({
                    proxies: values.proxies,
                    api_key: values.api_key
                }, {
                    onSuccess: res => {
                        const {code, message: msg, data} = res;
                        if (code === 0) {
                            message.success('更改配置成功，需要重启后才能生效。')
                            navigate("/setting/index");
                        } else {
                            message.error(msg)
                        }
                    }
                })
            } catch (error) {
                const message = error.message || "配置出错啦，容器能科学上网么？";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        getMovieMetadata({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    formik.setFieldValue("api_key", data?.tmdb?.api_key ? data.tmdb.api_key : '');
                    formik.setFieldValue("proxies", data?.tmdb?.proxies ? data.tmdb.proxies : '')
                }
            },
            onError: error => message.error(error)
        });
    }, []);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="text"
            name="api_key"
            label="TMDB API密钥"
            value={formik.values.api_key}
            error={Boolean(formik.touched.api_key && formik.errors.api_key)}
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
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
            >
                保存
            </Button>
        </Centered>
    </form>);
}

const EditTmdb = () => {
    return (<React.Fragment>
        <Helmet title="设置TheMovieDB API"/>
        <Typography variant="h3" gutterBottom display="inline">
            设置TheMovieDB API
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>TheMovieDB API</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditTmdb;