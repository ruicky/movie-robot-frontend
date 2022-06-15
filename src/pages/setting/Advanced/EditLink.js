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
    FormGroup,
    FormLabel,
    Link,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useGetLinkSetting, useGetServerSetting, useSaveLinkSetting, useSaveServerSetting} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);
const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;


function EditForm({}) {
    const navigate = useNavigate();
    const {data: setting, isLoading: isLoading} = useGetLinkSetting();
    const {mutateAsync: save, isSaving} = useSaveLinkSetting();
    const formik = useFormik({
        initialValues: {
            movie_filename_format: "",
            movie_folder_format: "",
            tv_filename_format: "",
            tv_folder_format: "",
            recognize: true,
            exact_year: true,
            use_unknown_dir: true
        }, validationSchema: Yup.object().shape({
            movie_filename_format: Yup.string().required("电影名称模版不能为空"),
            movie_folder_format: Yup.string().required("电影文件夹模版不能为空"),
            tv_filename_format: Yup.string().required("剧集名称模版不能为空"),
            tv_folder_format: Yup.string().required("剧集文件夹模版不能为空"),
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                save(values, {
                    onSuccess: res => {
                        const {code, message: msg, data} = res;
                        if (code === 0) {
                            message.success('识别与整理设置保存成功，已经生效了。')
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
            formik.setFieldValue("movie_filename_format", setting.data?.movie_filename_format ? setting.data?.movie_filename_format : "");
            formik.setFieldValue("movie_folder_format", setting.data?.movie_folder_format ? setting.data?.movie_folder_format : "");
            formik.setFieldValue("tv_filename_format", setting.data?.tv_filename_format ? setting.data?.tv_filename_format : "");
            formik.setFieldValue("tv_folder_format", setting.data?.tv_folder_format ? setting.data?.tv_folder_format : "");
            formik.setFieldValue("recognize", setting.data?.recognize !== undefined && setting.data?.recognize !== null ? setting.data?.recognize : true);
            formik.setFieldValue("exact_year", setting.data?.exact_year !== undefined && setting.data?.exact_year !== null ? setting.data?.exact_year : true);
            formik.setFieldValue("use_unknown_dir", setting.data?.use_unknown_dir !== undefined && setting.data?.use_unknown_dir !== null ? setting.data?.use_unknown_dir : true);
        }
    }, [setting]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <FormLabel component="legend">电影整理文件格式</FormLabel>
        <FormGroup>
            <TextField
                type="text"
                name="movie_filename_format"
                label="文件名格式"
                value={formik.values.movie_filename_format}
                error={Boolean(formik.touched.movie_filename_format && formik.errors.movie_filename_format)}
                fullWidth
                helperText="最终整理后文件名格式"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                my={3}
            />
            <TextField
                type="text"
                name="movie_folder_format"
                label="文件夹格式"
                value={formik.values.movie_folder_format}
                error={Boolean(formik.touched.movie_folder_format && formik.errors.movie_folder_format)}
                fullWidth
                helperText="最终整理后文件夹格式"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                my={3}
            />
        </FormGroup>
        <FormLabel component="legend">剧集整理文件格式</FormLabel>
        <FormGroup>
            <TextField
                type="text"
                name="tv_filename_format"
                label="文件名格式"
                value={formik.values.tv_filename_format}
                error={Boolean(formik.touched.tv_filename_format && formik.errors.tv_filename_format)}
                fullWidth
                helperText="最终整理后文件名格式"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                my={3}
            />
            <TextField
                type="text"
                name="tv_folder_format"
                label="文件夹格式"
                value={formik.values.tv_folder_format}
                error={Boolean(formik.touched.tv_folder_format && formik.errors.tv_folder_format)}
                fullWidth
                helperText="最终整理后文件夹格式"
                onBlur={formik.handleBlur}
                onChange={formik.handleChange}
                my={3}
            />
        </FormGroup>
        <FormLabel component="legend">其他设置</FormLabel>
        <FormGroup>
            <FormControlLabel
                control={<Checkbox
                    checked={formik.values.recognize}
                    onChange={formik.handleChange}
                    name="recognize"
                    disabled={true}
                />}
                label="启用内置识别分析技术，改名后整理。关闭将原样整理，并且无法使用后续任何智能化功能"
            />
            <FormControlLabel
                control={<Checkbox
                    checked={formik.values.exact_year}
                    onChange={formik.handleChange}
                    name="exact_year"
                />}
                label="当识别到多条结果时精确匹配年份"
            />
            <FormControlLabel
                control={<Checkbox
                    checked={formik.values.use_unknown_dir}
                    onChange={formik.handleChange}
                    name="use_unknown_dir"
                />}
                label="对未识别的影片是否归类到.unknown目录，关闭后将原样1:1链接到目标目录"
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
        <Helmet title="识别与整理设置"/>
        <Typography variant="h3" gutterBottom display="inline">
            识别与整理设置
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>识别与整理设置</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditSearchSetting;