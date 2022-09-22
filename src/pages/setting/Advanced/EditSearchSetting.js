import React, {useEffect} from "react";
import {NavLink, useNavigate} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Box,
    Breadcrumbs,
    Button,
    Checkbox,
    Chip,
    Divider as MuiDivider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Link,
    ListItemText,
    MenuItem,
    Select,
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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const SearchCates = ['Movie', 'TV', 'Anime', 'Documentary','Music'];

function EditForm({}) {
    const navigate = useNavigate();
    const {data: setting, isLoading} = useGetServerSetting();
    const {mutateAsync: save, isSaving} = useSaveServerSetting();
    const formik = useFormik({
        initialValues: {
            web_search_timeout: 10,
            web_search_result_limit: 0
        }, validationSchema: Yup.object().shape({
            web_search_timeout: Yup.number().required("搜索超时时间不能为空")
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                save(values, {
                    onSuccess: res => {
                        const {code, message: msg, data} = res;
                        if (code === 0) {
                            message.success('搜索设置保存成功，需要强制刷新浏览器页面才会生效。')
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
            formik.setFieldValue("web_search_timeout", setting.data?.web_search_timeout ? setting.data?.web_search_timeout : 10);
            formik.setFieldValue("web_search_result_limit", setting.data?.web_search_result_limit ? setting.data?.web_search_result_limit : 0);
        }
    }, [setting]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
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
        <Button
            type="submit"
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