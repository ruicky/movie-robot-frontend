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
import {useGetWeb, useSaveWeb} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;


function EditForm({isInit}) {
    const navigate = useNavigate();
    const {data: webSetting, isLoading: isLoading} = useGetWeb();
    const {mutateAsync: saveWeb, isSaving} = useSaveWeb();
    const formik = useFormik({
        initialValues: {
            host: "::", port: 1329, server_url: "http://"
        }, validationSchema: Yup.object().shape({
            host: Yup.string().max(64).required("主机地址必须填写"),
            port: Yup.string().max(5).required("网站服务端口号必须填写"),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                saveWeb({
                    host: values.host,
                    port: values.port,
                    server_url: values.server_url
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
                const message = error.message || "配置出错啦";

                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        if (webSetting?.data) {
            formik.setFieldValue("server_url", webSetting.data?.server_url ? webSetting.data?.server_url : '');
            formik.setFieldValue("port", webSetting.data?.port ? webSetting.data?.port : 1329);
            formik.setFieldValue("host", webSetting.data?.host ? webSetting.data?.host : '::');
        }
    }, [webSetting]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="text"
            name="server_url"
            label="站点访问地址"
            value={formik.values.server_url}
            error={Boolean(formik.touched.server_url && formik.errors.server_url)}
            fullWidth
            helperText="该地址适用于未来分享应用链接时访问，一般为外网可访问的地址，不开外网访问可以不填"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="host"
            label="主机"
            value={formik.values.host}
            error={Boolean(formik.touched.host && formik.errors.host)}
            fullWidth
            helperText=":: 支持IPV6，不懂不要改这个值"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="port"
            label="端口"
            value={formik.values.port}
            error={Boolean(formik.touched.port && formik.errors.port)}
            fullWidth
            helperText={(formik.touched.port && formik.errors.port) || "web服务启动端口，没有特殊需求不用改"}
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
            保存
        </Button>
    </form>);
}

const EditWeb = () => {
    return (<React.Fragment>
        <Helmet title="网站访问设置"/>
        <Typography variant="h3" gutterBottom display="inline">
            网站访问设置
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>网站访问</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditWeb;