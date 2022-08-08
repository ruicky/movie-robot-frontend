import message from "@/utils/message";
import pageMessage from "@/utils/message";
import {
    Autocomplete,
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
    Grid,
    Link,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import React, {useEffect, useImperativeHandle, useState} from "react";
import styled from "styled-components/macro";
import {getFilterOptions} from "@/api/CommonApi";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {Alert} from "@mui/lab";
import {spacing} from "@mui/system";
import {useGetSubCustom, useSubCustom} from "@/utils/subscribe";
import axios from "@/utils/request";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const Centered = styled.div`
  text-align: center;
`;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};
const mediaType = {"Movie": "电影", "TV": "剧集"}
const Divider = styled(MuiDivider)(spacing);

function FilterForm({
                        filterOptions,
                        onSubmit,
                        formValues,
                        myRef
                    }) {
    useImperativeHandle(myRef, () => ({
        onSubmit: formik.handleSubmit,
        getVal: () => formik.values
    }))
    const [releaseTeamOptions, setReleaseTeamOptions] = useState([]);
    const [paths, setPaths] = useState([])
    const [siteData, setSiteData] = useState([])
    let initValues = {
        filter_name: '',
        priority: 0,
        media_source: [],
        resolution: [],
        media_codec: [],
        has_cn: false,
        has_special: false,
        min_size: 0,
        max_size: 0,
        min_seeders: 0,
        max_seeders: 0,
        free_only: false,
        pass_hr: false,
        exclude_keyword: '',
        include_keyword: '',
        save_path: '',
        site_id: [],
        release_team: []
    };
    const formik = useFormik({
        initialValues: initValues,
        validationSchema: Yup.object().shape({}),
        onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                await setSubmitting(true);
                if (onSubmit) {
                    await onSubmit(values, setErrors);
                }
            } catch (error) {
                const message = error.message || "配置出错啦";
                pageMessage.error(message)
                setStatus({success: false});
                setErrors({submit: message});
            } finally {
                await setSubmitting(false);
            }
        }
    });
    const fillFormData = (data) => {
        const filter_config = JSON.parse(data?.filter_config);
        formik.setFieldValue("filter_name", data?.filter_name ? data?.filter_name : '')
        formik.setFieldValue("priority", filter_config?.priority ? filter_config?.priority : 0)
        formik.setFieldValue("media_source", filter_config?.media_source ? filter_config?.media_source : [])
        formik.setFieldValue("resolution", filter_config?.resolution ? filter_config?.resolution : [])
        formik.setFieldValue("media_codec", filter_config?.media_codec ? filter_config?.media_codec : [])
        formik.setFieldValue("has_cn", filter_config?.has_cn ? filter_config?.has_cn : false)
        formik.setFieldValue("has_special", filter_config?.has_special ? filter_config?.has_special : false)
        formik.setFieldValue("min_size", filter_config?.min_size ? filter_config?.min_size : 0)
        formik.setFieldValue("max_size", filter_config?.max_size ? filter_config?.max_size : 0)
        formik.setFieldValue("min_seeders", filter_config?.min_seeders ? filter_config?.min_seeders : 0)
        formik.setFieldValue("max_seeders", filter_config?.max_seeders ? filter_config?.max_seeders : 0)
        formik.setFieldValue("free_only", filter_config?.free_only ? filter_config?.free_only : false)
        formik.setFieldValue("pass_hr", filter_config?.pass_hr ? filter_config?.pass_hr : false)
        formik.setFieldValue("exclude_keyword", filter_config?.exclude_keyword ? filter_config?.exclude_keyword : '')
        formik.setFieldValue("include_keyword", filter_config?.include_keyword ? filter_config?.include_keyword : '')
        formik.setFieldValue("save_path", data?.save_path ? data?.save_path : '')
        formik.setFieldValue("site_id", filter_config?.site_id ? filter_config?.site_id : [])
        formik.setFieldValue("release_team", filter_config?.release_team ? filter_config?.release_team : [])
    }
    useEffect(() => {
        axios.get("/api/config/get_media_path").then((res) => {
            const data = res.data;
            if (data) {
                setPaths(data.paths);
            }
        });
        axios.get("/api/site/get_sites").then((res) => {
            if (res.code === 0) {
                setSiteData(res.data)
            }
        })
    }, [])
    useEffect(async () => {
        if (formValues) {
            await fillFormData(formValues)
        }

    }, [formValues])
    useEffect(() => {
        setReleaseTeamOptions(filterOptions?.release_team && filterOptions?.release_team.map((item) => {
            return {title: item}
        }) || []);
    }, [filterOptions])
    return (
        <form noValidate onSubmit={formik.handleSubmit}>
            {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
                {formik.errors.submit}
            </Alert>)}
            <FormLabel sx={{my: 3}} component="legend">过滤器名称</FormLabel>
            <FormGroup>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={8}>
                        <TextField
                            type="text"
                            name="filter_name"
                            label="过滤器名称"
                            value={formik.values.filter_name}
                            error={Boolean(formik.touched.filter_name && formik.errors.filter_name)}
                            fullWidth
                            helperText={formik.touched.filter_name && formik.errors.filter_name || (
                                <span>
                                            为过滤器随便起个名字，方便区分。
                                        </span>
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            my={3}
                        />
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <TextField
                            type="number"
                            name="priority"
                            label="优先级"
                            value={formik.values.priority}
                            error={Boolean(formik.touched.priority && formik.errors.priority)}
                            fullWidth
                            helperText={formik.touched.priority && formik.errors.priority || (
                                <span>
                                            优先级高的先处理，数字越大优先级越高
                                        </span>
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            my={3}
                        />
                    </Grid>
                </Grid>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">下载保存路径</FormLabel>
            <FormGroup>
                <FormControl m={4} fullWidth>
                    <Select
                        name="save_path"
                        value={formik.values.save_path}
                        onChange={formik.handleChange}
                        MenuProps={MenuProps}
                    >
                        {paths && paths.map((item, index) => (
                            <MenuItem value={item.download_path}>{item.download_path}</MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        {formik.touched.save_path && formik.errors.save_path || (
                            <span>
                                种子将会保存到此路径
                            </span>
                        )}
                    </FormHelperText>
                </FormControl>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">只从以下站点过滤</FormLabel>
            <FormGroup>
                <FormControl m={4} fullWidth>
                    <Select
                        name="site_id"
                        value={formik.values.site_id}
                        multiple
                        onChange={formik.handleChange}
                        renderValue={(selected) => (
                            <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                {selected.map((value, index) => (
                                    <Chip key={index}
                                          label={siteData && siteData.find(item => item.site_name === value).alias}/>
                                ))}
                            </Box>
                        )}
                        error={Boolean(formik.touched.site_id && formik.errors.site_id)}
                        MenuProps={MenuProps}
                    >
                        {(siteData || []).map((item, index) => (
                            <MenuItem key={index} value={item.site_name}>
                                <Checkbox checked={formik.values.site_id.indexOf(item.site_name) > -1}/>
                                <ListItemText primary={item.alias}/>
                            </MenuItem>
                        ))}
                    </Select>
                    <FormHelperText>
                        {formik.touched.site_id && formik.errors.site_id || (
                            <span>
                                只会从选中的站点中过滤资源，留空为所有
                            </span>
                        )}
                    </FormHelperText>
                </FormControl>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">保留包含特定关键字的结果</FormLabel>
            <FormGroup>
                <TextField
                    type="text"
                    name="include_keyword"
                    label="保留关键字"
                    value={formik.values.include_keyword}
                    error={Boolean(formik.touched.include_keyword && formik.errors.include_keyword)}
                    fullWidth
                    helperText={formik.touched.include_keyword && formik.errors.include_keyword || (
                        <span>
                                      只保留包含设定关键字的种子，多个关键字用英文逗号,隔开（或者的关系）
                               </span>
                    )}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    my={3}
                />
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">排除包含特定关键字的结果</FormLabel>
            <FormGroup>
                <TextField
                    type="text"
                    name="exclude_keyword"
                    label="排除"
                    value={formik.values.exclude_keyword}
                    error={Boolean(formik.touched.exclude_keyword && formik.errors.exclude_keyword)}
                    fullWidth
                    helperText={formik.touched.exclude_keyword && formik.errors.exclude_keyword || (
                        <span>
                                            标题或种子名中包含任意一个关键字时排除掉，多个关键字用英文逗号,隔开（或者的关系）
                                        </span>
                    )}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    my={3}
                />
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">制作组</FormLabel>
            <FormGroup>
                <FormControl m={4} fullWidth>
                    <Autocomplete
                        multiple
                        getOptionLabel={(option) => option.title}
                        value={releaseTeamOptions.filter((item) => {
                            return formik.values.release_team.includes(item.title)
                        })}
                        onChange={(e, val) => formik.setFieldValue('release_team', val.map((item) => {
                            return item.title
                        }))}
                        id="release_team"
                        options={releaseTeamOptions}
                        renderInput={(params) => <TextField {...params} placeholder="制作组"/>}
                        fullWidth
                    />
                    <FormHelperText>
                        {formik.touched.release_team && formik.errors.release_team || (
                            <span>
                                想要的制作组，留空不限制
                            </span>
                        )}
                    </FormHelperText>
                </FormControl>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">媒体类型品质</FormLabel>
            <FormGroup>
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4}>
                        <FormControl m={4} fullWidth>
                            <Select
                                name="media_source"
                                value={formik.values.media_source}
                                multiple
                                onChange={formik.handleChange}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value}/>
                                        ))}
                                    </Box>
                                )}
                                error={Boolean(formik.touched.media_source && formik.errors.media_source)}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="全部来源">
                                    <Checkbox checked={formik.values.media_source.indexOf("全部来源") > -1}/>
                                    <ListItemText primary="全部来源"/>
                                </MenuItem>
                                {filterOptions?.media_source && filterOptions?.media_source.map((item) => (
                                    <MenuItem key={item} value={item}>
                                        <Checkbox checked={formik.values.media_source.indexOf(item) > -1}/>
                                        <ListItemText primary={item}/>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {formik.touched.media_source && formik.errors.media_source || (
                                    <span>
                                想要的存储介质，可留空
                            </span>
                                )}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl m={4} fullWidth>
                            <Select
                                name="resolution"
                                value={formik.values.resolution}
                                multiple
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.resolution && formik.errors.resolution)}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value}/>
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="全部分辨率">
                                    <Checkbox checked={formik.values.resolution.indexOf("全部分辨率") > -1}/>
                                    <ListItemText primary="全部分辨率"/>
                                </MenuItem>
                                {filterOptions?.resolution && filterOptions?.resolution.map((item) => (
                                    <MenuItem key={item} value={item}>
                                        <Checkbox checked={formik.values.resolution.indexOf(item) > -1}/>
                                        <ListItemText primary={item}/>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {formik.touched.resolution && formik.errors.resolution || (
                                    <span>
                                想要的分辨率，可留空
                            </span>
                                )}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <FormControl m={4} fullWidth>
                            <Select
                                name="media_codec"
                                value={formik.values.media_codec}
                                multiple
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.media_codec && formik.errors.media_codec)}
                                renderValue={(selected) => (
                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                        {selected.map((value) => (
                                            <Chip key={value} label={value}/>
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="全部编码">
                                    <Checkbox checked={formik.values.media_codec.indexOf("全部编码") > -1}/>
                                    <ListItemText primary="全部编码"/>
                                </MenuItem>
                                {filterOptions?.media_codec && filterOptions?.media_codec.map((item) => (
                                    <MenuItem key={item} value={item}>
                                        <Checkbox checked={formik.values.media_codec.indexOf(item) > -1}/>
                                        <ListItemText primary={item}/>
                                    </MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>
                                {formik.touched.media_codec && formik.errors.media_codec || (
                                    <span>
                                想要的编码类型，可留空
                            </span>
                                )}
                            </FormHelperText>
                        </FormControl>
                    </Grid>
                </Grid>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">文件尺寸规格</FormLabel>
            <FormGroup>
                <Grid container spacing={4}>
                    <Grid item xs={6} md={6}>
                        <TextField
                            type="number"
                            name="min_size"
                            label="最小尺寸"
                            value={formik.values.min_size}
                            error={Boolean(formik.touched.min_size && formik.errors.min_size)}
                            fullWidth
                            helperText={formik.touched.min_size && formik.errors.min_size || (
                                <span>
                                            文件尺寸下限，单位MB，留0为不限制
                                        </span>
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            my={3}
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TextField
                            type="number"
                            name="max_size"
                            label="最大尺寸"
                            value={formik.values.max_size}
                            error={Boolean(formik.touched.max_size && formik.errors.max_size)}
                            fullWidth
                            helperText={formik.touched.max_size && formik.errors.max_size || (
                                <span>
                                            文件尺寸上限，单位MB，留0为不限制
                                        </span>
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            my={3}
                        />
                    </Grid>
                </Grid>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">做种人数要求</FormLabel>
            <FormGroup>
                <Grid container spacing={4}>
                    <Grid item xs={6} md={6}>
                        <TextField
                            type="number"
                            name="min_seeders"
                            label="最小做种人数"
                            value={formik.values.min_seeders}
                            error={Boolean(formik.touched.min_seeders && formik.errors.min_seeders)}
                            fullWidth
                            helperText={formik.touched.min_seeders && formik.errors.min_seeders || (
                                <span>
                                            最小做种人数，留0为不限制
                                        </span>
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            my={3}
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <TextField
                            type="number"
                            name="max_seeders"
                            label="最大做种人数"
                            value={formik.values.max_seeders}
                            error={Boolean(formik.touched.max_seeders && formik.errors.max_seeders)}
                            fullWidth
                            helperText={formik.touched.max_seeders && formik.errors.max_seeders || (
                                <span>
                                            最大做种人数，留0为不限制
                                        </span>
                            )}
                            onBlur={formik.handleBlur}
                            onChange={formik.handleChange}
                            my={3}
                        />
                    </Grid>
                </Grid>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">字幕要求</FormLabel>
            <FormGroup>
                <Grid container spacing={4}>
                    <Grid item xs={6} md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={formik.values.has_cn}
                                name="has_cn"
                                onChange={formik.handleChange}
                            />}
                            label="必须有中文字幕"
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={formik.values.has_special}
                                name="has_special"
                                onChange={formik.handleChange}
                            />}
                            label="必须是特效字幕"
                        />
                    </Grid>
                </Grid>
            </FormGroup>
            <FormLabel sx={{my: 3}} component="legend">其他要求</FormLabel>
            <FormGroup>
                <Grid container spacing={4}>
                    <Grid item xs={6} md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={formik.values.free_only}
                                name="free_only"
                                onChange={formik.handleChange}
                            />}
                            label="只要不计下载量的种子"
                        />
                    </Grid>
                    <Grid item xs={6} md={6}>
                        <FormControlLabel
                            control={<Checkbox
                                checked={formik.values.pass_hr}
                                name="pass_hr"
                                onChange={formik.handleChange}
                            />}
                            label="排除需要HR考核的种子"
                        />
                    </Grid>
                </Grid>
            </FormGroup>
            {!myRef && <Centered>
                <Button
                    sx={{mr: 2}}
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                >
                    保存
                </Button>
            </Centered>}

        </form>
    );

}

function EditSubCustomFilter() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [formValues, setFormValues] = useState();
    const [filterOptions, setFilterOptions] = useState();
    const {mutate: getSubCustom, isLoading} = useGetSubCustom();
    const {mutateAsync: save, isSaving} = useSubCustom();
    const onSubmit = async (values, setErrors) => {
        values['id'] = searchParams.get("id");
        save(values, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg)
                    navigate("/subscribe/list?tab=custom");
                } else {
                    message.error(msg)
                }
            }
        })
    }
    useEffect(async () => {
        const filterOptions = await getFilterOptions()
        setFilterOptions(filterOptions)
        if (searchParams.get("id")) {
            getSubCustom({id: searchParams.get("id")}, {
                onSuccess: resData => {
                    const {code, message: msg, data} = resData;
                    if (code === 0) {
                        setFormValues(data)
                    } else {
                        message.error(msg);
                    }
                },
                onError: error => message.error(error)
            })
        }
    }, [searchParams])
    return (
        <React.Fragment>
            <Typography variant="h3" gutterBottom display="inline">
                自定义订阅条件设置
            </Typography>

            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                <Link component={NavLink} to="/subscribe/custom-index">
                    自定义关键字订阅
                </Link>
                <Typography>条件设置</Typography>
            </Breadcrumbs>
            <Divider my={4}/>
            <FilterForm formValues={formValues} filterOptions={filterOptions} onSubmit={onSubmit}/>
        </React.Fragment>
    )
}

export default EditSubCustomFilter;