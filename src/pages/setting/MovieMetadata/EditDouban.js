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
import {useGetMovieMetadata, useSaveDouban, useSaveFanArt, useSaveTmdb} from "@/api/SettingApi";
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
    const {mutateAsync: saveDouban, isSaving} = useSaveDouban();

    const formik = useFormik({
        initialValues: {
            cookie: ''
        }, validationSchema: Yup.object().shape({
            cookie: Yup.string().max(2000).required(),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                saveDouban({
                    cookie: values.cookie
                }, {
                    onSuccess: res => {
                        const {code, message: msg, data} = res;
                        if (code === 0) {
                            navigate("/setting/index");
                        } else {
                            message.error(msg)
                        }
                    }
                })
            } catch (error) {
                const message = error.message || "配置出错啦，容器能上网么？";
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
                    formik.setFieldValue("cookie", data?.douban?.cookie ? data.douban.cookie : '');
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
            name="cookie"
            label="Cookie"
            value={formik.values.cookie}
            error={Boolean(formik.touched.cookie && formik.errors.cookie)}
            fullWidth
            helperText={(
                <span>
                    任意用户访问豆瓣的Cookie，一些电影不登陆读不到详情
                    <Link target="_blank"
                          href="https://movie.douban.com/">
                            去获取Cookie
                        </Link>
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

const EditDouban = () => {
    return (<React.Fragment>
        <Helmet title="设置豆瓣电影"/>
        <Typography variant="h3" gutterBottom display="inline">
            设置豆瓣电影
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>设置豆瓣电影</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditDouban;