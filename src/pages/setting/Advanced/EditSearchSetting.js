import React, {useEffect} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Breadcrumbs,
    Button,
    Checkbox,
    Divider as MuiDivider,
    FormControlLabel,
    FormGroup, FormLabel,
    Link,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useGetServerSetting, useSaveServerSetting} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;


function EditForm({isInit}) {
    const navigate = useNavigate();
    const {data: setting, isLoading: isLoading} = useGetServerSetting();
    const {mutateAsync: save, isSaving} = useSaveServerSetting();
    const formik = useFormik({
        initialValues: {
            site_max_workers: 0,
            web_search_timeout: 10,
            web_search_result_limit: 0,
            auth_search_result: false
        }, validationSchema: Yup.object().shape({
            site_max_workers: Yup.number().required("最大搜索线程不能为空"),
            web_search_timeout: Yup.number().required("搜索超时时间不能为空")
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                save(values, {
                    onSuccess: res => {
                        const {code, message: msg, data} = res;
                        if (code === 0) {
                            message.success('搜索设置保存成功，已经生效了。')
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
        if (setting?.data) {
            formik.setFieldValue("site_max_workers", setting.data?.site_max_workers ? setting.data?.site_max_workers : 0);
            formik.setFieldValue("web_search_timeout", setting.data?.web_search_timeout ? setting.data?.web_search_timeout : 10);
            formik.setFieldValue("web_search_result_limit", setting.data?.web_search_result_limit ? setting.data?.web_search_result_limit : 0);
            formik.setFieldValue("auth_search_result", setting.data?.auth_search_result != undefined && setting.data?.auth_search_result != null ? setting.data?.auth_search_result : false);
        }
    }, [setting]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="number"
            name="site_max_workers"
            label="最大搜索线程数"
            value={formik.values.site_max_workers}
            error={Boolean(formik.touched.site_max_workers && formik.errors.site_max_workers)}
            fullWidth
            helperText="多站点搜索是IO密集型操作，所以这个值建议是你的cpu核心数*1.5"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="web_search_timeout"
            label="连接网站超时时间(秒)"
            value={formik.values.web_search_timeout}
            error={Boolean(formik.touched.web_search_timeout && formik.errors.web_search_timeout)}
            fullWidth
            helperText="连接网络的超时时间，越大意味着你在网页等的越久，不要超过60秒"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="number"
            name="web_search_result_limit"
            label="返回给页面的最大结果条数"
            value={formik.values.web_search_result_limit}
            error={Boolean(formik.touched.web_search_result_limit && formik.errors.web_search_result_limit)}
            fullWidth
            helperText="页面展示太多，网页也会卡，可以通过这个参数限制结果数，0为不限制，默认不限制"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <FormLabel component="legend">以下配置变更后需要强制刷新浏览器页面才可以生效</FormLabel>
        <FormGroup>
            <FormControlLabel
                control={<Checkbox
                    checked={formik.values.auth_search_result}
                    onChange={formik.handleChange}
                    name="auth_search_result"
                />}
                label="搜索时自动去站点进行资源搜索"
            />
        </FormGroup>
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

const EditSearchSetting = () => {
    return (<React.Fragment>
        <Helmet title="搜索设置"/>
        <Typography variant="h3" gutterBottom display="inline">
            搜索设置
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>搜索设置</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditSearchSetting;