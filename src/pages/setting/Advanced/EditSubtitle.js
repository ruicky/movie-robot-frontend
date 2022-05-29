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
    FormHelperText,
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
import {useGetSubtitleSetting, useSaveSubtitle} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;
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
const SUBTITLE_TYPES = ["srt", "ass", "sup"]
const SUBTITLE_FINDERS = ["zimuku", "subhd"]
const SYNC_LANGUAGES = ["zh-cn", "zh-tw"]
const AREAS = ["中国大陆", "中国台湾", "中国香港", "日本", "韩国", "美国", "英国", "泰国", "意大利"];

function EditForm({}) {
    const navigate = useNavigate();
    const {data: setting, isLoading: isLoading} = useGetSubtitleSetting();
    const {mutateAsync: save, isSaving} = useSaveSubtitle();

    const formik = useFormik({
        initialValues: {
            enable: false,
            file_name_template: "{{ name }}.{{ language[0] }}{% if language[0] == \"zh-cn\" and language | length == 2 %}.default{% endif%}{{ subtitle_ext }}",
            filter_type: ["srt", "ass"],
            finder_type: ["zimuku", "subhd"],
            sync_language: ["zh-cn", "zh-tw"],
            subhd_check_code: "",
            exclude_area: ["中国大陆", "中国台湾"],
            not_found_stop_minutes: 4320
        }, validationSchema: Yup.object().shape({
            file_name_template: Yup.string().max(2000).required("字幕文件名模版不能为空")
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                save(values, {
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
                const message = error.message || "配置出错，请检查网络链接";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        if (setting && setting?.data) {
            const data = setting.data;
            formik.setFieldValue("enable", data.enable !== undefined && data.enable !== null ? data.enable : false);
            formik.setFieldValue("file_name_template", data.file_name_template ? data.file_name_template : '{{ name }}.{{ language[0] }}{% if language[0] == "zh-cn" and language | length == 2 %}.default{% endif%}{{ subtitle_ext }}');
            formik.setFieldValue("filter_type", data.filter_type ? data.filter_type : ['srt', 'ass']);
            formik.setFieldValue("finder_type", data.finder_type ? data.finder_type : ['zimuku', 'subhd']);
            formik.setFieldValue("sync_language", data.sync_language ? data.sync_language : ['zh-cn', 'zh-tw']);
            formik.setFieldValue("exclude_area", data.exclude_area ? data.exclude_area : ["中国大陆", "中国台湾"]);
            formik.setFieldValue("subhd_check_code", data.subhd_check_code ? data.subhd_check_code : '');
            formik.setFieldValue("not_found_stop_minutes", data.not_found_stop_minutes !== null && data.not_found_stop_minutes !== undefined ? data.not_found_stop_minutes : 4320);
        }
    }, [setting]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="text"
            name="not_found_stop_minutes"
            label="无字幕时等待时间上限"
            value={formik.values.not_found_stop_minutes}
            error={Boolean(formik.touched.not_found_stop_minutes && formik.errors.not_found_stop_minutes)}
            fullWidth
            helperText={formik.touched.not_found_stop_minutes && formik.errors.not_found_stop_minutes || (
                <span>
                    单位分钟，默认3天。再此设置的期限内，会持续查找字幕，但频率不会很高，后期可能1天1次
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="file_name_template"
            label="文件名模版"
            value={formik.values.file_name_template}
            error={Boolean(formik.touched.file_name_template && formik.errors.file_name_template)}
            fullWidth
            helperText={formik.touched.file_name_template && formik.errors.file_name_template || (
                <span>
                    最终生成字幕的文件名模版，默认为Emby字幕文件命名规则
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <FormControl m={4} fullWidth>
            <Select
                name="exclude_area"
                value={formik.values.exclude_area}
                multiple
                onChange={formik.handleChange}
                error={Boolean(formik.touched.exclude_area && formik.errors.exclude_area)}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {AREAS && AREAS.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        <Checkbox
                            checked={formik.values.exclude_area.indexOf(item) > -1}/>
                        <ListItemText primary={item}/>
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>
                {formik.touched.exclude_area && formik.errors.exclude_area || (
                    <span>
                                                排除这些区域的字幕下载
                                            </span>
                )}
            </FormHelperText>
        </FormControl>
        <FormControl m={4} fullWidth>
            <Select
                name="finder_type"
                value={formik.values.finder_type}
                multiple
                onChange={formik.handleChange}
                error={Boolean(formik.touched.finder_type && formik.errors.finder_type)}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {SUBTITLE_FINDERS && SUBTITLE_FINDERS.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        <Checkbox
                            checked={formik.values.finder_type.indexOf(item) > -1}/>
                        <ListItemText primary={item}/>
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>
                {formik.touched.finder_type && formik.errors.finder_type || (
                    <span>
                                                只从此处设置的字幕来源下载字幕
                                            </span>
                )}
            </FormHelperText>
        </FormControl>
        <FormControl m={4} fullWidth>
            <Select
                name="filter_type"
                value={formik.values.filter_type}
                multiple
                onChange={formik.handleChange}
                error={Boolean(formik.touched.filter_type && formik.errors.filter_type)}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {SUBTITLE_TYPES && SUBTITLE_TYPES.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        <Checkbox
                            checked={formik.values.filter_type.indexOf(item) > -1}/>
                        <ListItemText primary={item}/>
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>
                {formik.touched.filter_type && formik.errors.filter_type || (
                    <span>
                                                只下载此处设置的字幕格式
                                            </span>
                )}
            </FormHelperText>
        </FormControl>
        <FormControl m={4} fullWidth>
            <Select
                name="filter_type"
                value={formik.values.sync_language}
                multiple
                onChange={formik.handleChange}
                error={Boolean(formik.touched.sync_language && formik.errors.sync_language)}
                renderValue={(selected) => (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {selected.map((value) => (
                            <Chip key={value} label={value}/>
                        ))}
                    </Box>
                )}
                MenuProps={MenuProps}
            >
                {SYNC_LANGUAGES && SYNC_LANGUAGES.map((item, index) => (
                    <MenuItem key={index} value={item}>
                        <Checkbox
                            checked={formik.values.sync_language.indexOf(item) > -1}/>
                        <ListItemText primary={item}/>
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>
                {formik.touched.sync_language && formik.errors.sync_language || (
                    <span>
                                                对以上设定的字幕语言做时间轴同步
                                            </span>
                )}
            </FormHelperText>
        </FormControl>
        <TextField
            type="text"
            name="subhd_check_code"
            label="SubHD下载验证码"
            value={formik.values.subhd_check_code}
            error={Boolean(formik.touched.subhd_check_code && formik.errors.subhd_check_code)}
            fullWidth
            helperText={formik.touched.subhd_check_code && formik.errors.subhd_check_code || (
                <span>
                    SubHD定期下载验证码，需要去他们的微信公众号获取，每个月好像都会更新；使用SubHD时必填；
                </span>
            )}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <FormControlLabel
            control={<Checkbox
                checked={formik.values.enable}
                name="enable"
                onChange={formik.handleChange}
            />}
            label="开启字幕自动下载"
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


const EditSubtitle = () => {
    return (<React.Fragment>
        <Helmet title="设置字幕自动下载"/>
        <Typography variant="h3" gutterBottom display="inline">
            设置字幕自动下载
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>字幕自动下载</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditSubtitle;