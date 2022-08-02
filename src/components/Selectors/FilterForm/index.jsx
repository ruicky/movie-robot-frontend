import {useFormik} from "formik";
import * as Yup from "yup";
import pageMessage from "@/utils/message";
import {Alert} from "@mui/lab";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
    Chip,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    ListItemText,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, {useContext, useEffect, useImperativeHandle, useState} from "react";
import styled from "styled-components/macro";
import {FilterOptionsContext} from "@/components/Selectors/FilterOptionsProvider";
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

function FilterForm({
                        filterOptions,
                        onSubmit,
                        formValues,
                        showFilterName = true,
                        showApplyInfo = true,
                        showDownloadMode = true,
                        showFilterTemplate = false,
                        myRef
                    }) {
    useImperativeHandle(myRef, () => ({
        onSubmit: formik.handleSubmit,
        getVal: () => formik.values
    }))
    const filterOptionsContextData = useContext(FilterOptionsContext)
    const [releaseTeamOptions, setReleaseTeamOptions] = useState([]);
    const [siteData, setSiteData] = useState([])

    let initValues = {
        filter_name: '',
        priority: 0,
        download_mode: 2,
        apply_media_type: [],
        apply_cate: [],
        apply_area: [],
        apply_min_year: 0,
        apply_max_year: 0,
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
        release_team: [],
        site_id: []

    };
    if (!showFilterName) {
        delete initValues.filter_name;
        delete initValues.priority;
    }
    if (!showApplyInfo) {
        delete initValues.apply_media_type;
        delete initValues.apply_cate;
        delete initValues.apply_area;
        delete initValues.apply_min_year;
        delete initValues.apply_max_year;
    }
    if (!showDownloadMode) {
        delete initValues.download_mode;
    }
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
        if (showFilterName) {
            formik.setFieldValue("filter_name", data?.filter_name ? data?.filter_name : '')
            formik.setFieldValue("priority", data?.priority ? data?.priority : 0)
        }
        if (showApplyInfo) {
            formik.setFieldValue("apply_media_type", data?.apply_media_type ? data?.apply_media_type : [])
            formik.setFieldValue("apply_cate", data?.apply_cate ? data?.apply_cate : [])
            formik.setFieldValue("apply_area", data?.apply_area ? data?.apply_area : [])
            formik.setFieldValue("apply_min_year", data?.apply_min_year ? data?.apply_min_year : 0)
            formik.setFieldValue("apply_max_year", data?.apply_max_year ? data?.apply_max_year : 0)
        }
        formik.setFieldValue("media_source", data?.media_source ? data?.media_source : [])
        if (showDownloadMode) {
            formik.setFieldValue("download_mode", data?.download_mode ? data?.download_mode : 2)
        }
        formik.setFieldValue("resolution", data?.resolution ? data?.resolution : [])
        formik.setFieldValue("media_codec", data?.media_codec ? data?.media_codec : [])
        formik.setFieldValue("has_cn", data?.has_cn ? data?.has_cn : false)
        formik.setFieldValue("has_special", data?.has_special ? data?.has_special : false)
        formik.setFieldValue("min_size", data?.min_size ? data?.min_size : 0)
        formik.setFieldValue("max_size", data?.max_size ? data?.max_size : 0)
        formik.setFieldValue("min_seeders", data?.min_seeders ? data?.min_seeders : 0)
        formik.setFieldValue("max_seeders", data?.max_seeders ? data?.max_seeders : 0)
        formik.setFieldValue("free_only", data?.free_only ? data?.free_only : false)
        formik.setFieldValue("pass_hr", data?.pass_hr ? data?.pass_hr : false)
        formik.setFieldValue("exclude_keyword", data?.exclude_keyword ? data?.exclude_keyword : '')
        formik.setFieldValue("include_keyword", data?.include_keyword ? data?.include_keyword : '');
        formik.setFieldValue("release_team", data?.release_team ? data?.release_team : []);
        formik.setFieldValue("site_id", data?.site_id ? data?.site_id : [])

    }
    const selectFilterTemplate = async (e) => {
        if (e.target.value === "clear") {
            fillFormData(null);
        }
        if (filterOptionsContextData?.filter_list) {
            let result = filterOptionsContextData?.filter_list.filter((item, index) => {
                return item.filter_name === e.target.value;
            });
            if (result) {
                fillFormData(result[0])
            }
        }
    }
    useEffect(() => {
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
            {showFilterTemplate ? <Card>
                <Typography component="h3" align="left">
                    选择现有参考
                </Typography>
                <CardContent>
                    <FormControl m={4} fullWidth>
                        <Select
                            name="filterTemplate"
                            onChange={selectFilterTemplate}
                        >
                            <MenuItem value="clear">清空设置</MenuItem>
                            {filterOptionsContextData?.filter_name_list ? filterOptionsContextData?.filter_name_list.map((value, i) => (
                                <MenuItem key={value} value={value}>{value}</MenuItem>
                            )) : <MenuItem>没有设置任何过滤器</MenuItem>}
                        </Select>
                        <FormHelperText>
                <span>
                    将按照设定的过滤器去选择资源
                </span></FormHelperText>
                    </FormControl>
                </CardContent>
            </Card> : null}
            {showFilterName ? <Card>
                <Typography component="h3" align="left">
                    过滤器名称
                </Typography>
                <CardContent>
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
                                            匹配到多个过滤器时优先级，数字越大优先级越高
                                        </span>
                                )}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                my={3}
                            />
                        </Grid>
                    </Grid>
                </CardContent>
            </Card> : null}
            {showApplyInfo ?
                <Card>
                    <Typography component="h3" align="left">
                        满足以下分类设定时自动使用此过滤器
                    </Typography>
                    <CardContent>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <Grid container spacing={4}>
                                    <Grid item xs={12} md={4}>
                                        <FormControl m={4} fullWidth>
                                            <Select
                                                name="apply_media_type"
                                                value={formik.values.apply_media_type}
                                                multiple
                                                onChange={formik.handleChange}
                                                renderValue={(selected) => (
                                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={mediaType[value]}/>
                                                        ))}
                                                    </Box>
                                                )}
                                                error={Boolean(formik.touched.apply_media_type && formik.errors.apply_media_type)}
                                                MenuProps={MenuProps}
                                            >
                                                {Object.keys(mediaType).map((key) => (
                                                    <MenuItem key={key} value={key}>
                                                        <Checkbox
                                                            checked={formik.values.apply_media_type.indexOf(key) > -1}/>
                                                        <ListItemText primary={mediaType[key]}/>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {formik.touched.apply_media_type && formik.errors.apply_media_type || (
                                                    <span>
                                                匹配媒体资源类型时，可留空，或的关系
                                            </span>
                                                )}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl m={4} fullWidth>
                                            <Select
                                                name="apply_cate"
                                                value={formik.values.apply_cate}
                                                multiple
                                                onChange={formik.handleChange}
                                                error={Boolean(formik.touched.apply_cate && formik.errors.apply_cate)}
                                                renderValue={(selected) => (
                                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value}/>
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem value="全部分类">
                                                    <Checkbox checked={formik.values.apply_cate.indexOf("全部分类") > -1}/>
                                                    <ListItemText primary="全部分类"/>
                                                </MenuItem>
                                                {filterOptions?.cate && filterOptions?.cate.map((item) => (
                                                    <MenuItem key={item} value={item}>
                                                        <Checkbox
                                                            checked={formik.values.apply_cate.indexOf(item) > -1}/>
                                                        <ListItemText primary={item}/>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {formik.touched.apply_cate && formik.errors.apply_cate || (
                                                    <span>
                                                匹配设定分类时，可留空，或的关系
                                            </span>
                                                )}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={4}>
                                        <FormControl m={4} fullWidth>
                                            <Select
                                                name="apply_area"
                                                value={formik.values.apply_area}
                                                multiple
                                                onChange={formik.handleChange}
                                                error={Boolean(formik.touched.apply_area && formik.errors.apply_area)}
                                                renderValue={(selected) => (
                                                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                                                        {selected.map((value) => (
                                                            <Chip key={value} label={value}/>
                                                        ))}
                                                    </Box>
                                                )}
                                                MenuProps={MenuProps}
                                            >
                                                <MenuItem value="全部区域">
                                                    <Checkbox checked={formik.values.apply_area.indexOf("全部区域") > -1}/>
                                                    <ListItemText primary="全部区域"/>
                                                </MenuItem>
                                                {filterOptions?.area && filterOptions?.area.map((item) => (
                                                    <MenuItem key={item} value={item}>
                                                        <Checkbox
                                                            checked={formik.values.apply_area.indexOf(item) > -1}/>
                                                        <ListItemText primary={item}/>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                            <FormHelperText>
                                                {formik.touched.apply_area && formik.errors.apply_area || (
                                                    <span>
                                                匹配设定区域时，可留空，或的关系
                                            </span>
                                                )}
                                            </FormHelperText>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                <Grid container spacing={4}>
                                    <Grid item xs={6} md={6}>
                                        <TextField
                                            type="number"
                                            name="apply_min_year"
                                            label="最小年份"
                                            value={formik.values.apply_min_year}
                                            error={Boolean(formik.touched.apply_min_year && formik.errors.apply_min_year)}
                                            fullWidth
                                            helperText={formik.touched.apply_min_year && formik.errors.apply_min_year || (
                                                <span>
                                            匹配发行年份大于此年份值（剧集为季度年份），留0为不限制
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
                                            name="apply_max_year"
                                            label="最大年份"
                                            value={formik.values.apply_max_year}
                                            error={Boolean(formik.touched.apply_max_year && formik.errors.apply_max_year)}
                                            fullWidth
                                            helperText={formik.touched.apply_max_year && formik.errors.apply_max_year || (
                                                <span>
                                            匹配发行年份小于此年份值，留0为不限制
                                        </span>
                                            )}
                                            onBlur={formik.handleBlur}
                                            onChange={formik.handleChange}
                                            my={3}
                                        />
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card> : null}
            {showDownloadMode ?
                <Card>
                    <Typography component="h3" align="left">
                        过滤下载模式
                    </Typography>
                    <CardContent>
                        <FormControl m={4} fullWidth>
                            <Select
                                name="download_mode"
                                value={formik.values.download_mode}
                                onChange={formik.handleChange}
                                error={Boolean(formik.touched.download_mode && formik.errors.download_mode)}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value={1}>完全符合过滤器要求时才下载</MenuItem>
                                <MenuItem value={2}>先按排序规则下载，之后遇到符合规格再替换</MenuItem>
                            </Select>
                            <FormHelperText>
                                {formik.touched.download_mode && formik.errors.download_mode || (
                                    <span>
                                匹配此过滤器时的下载模式，注意：剧集仅支持完全匹配
                            </span>
                                )}
                            </FormHelperText>
                        </FormControl>
                    </CardContent>
                </Card> : null}
            <Card>
                <Typography component="h3" align="left">
                    只从以下站点过滤
                </Typography>
                <CardContent>
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
                                              label={siteData && (siteData.find(item => item.site_name === value) || {alias: ''}).alias}/>
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
                </CardContent>
            </Card>
            <Card>
                <Typography component="h3" align="left">
                    媒体类型品质
                </Typography>
                <CardContent>
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
                        <Grid item xs={12} md={12}>
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
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <Card>
                <Typography component="h3" align="left">
                    字幕要求
                </Typography>
                <CardContent>
                    <Grid container spacing={4}>
                        <Grid item xs={6} md={4}>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={formik.values.has_cn}
                                    name="has_cn"
                                    onChange={formik.handleChange}
                                />}
                                label="必须有中文字幕"
                            />
                        </Grid>
                        <Grid item xs={6} md={4}>
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
                </CardContent>
            </Card>
            <Accordion>
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                >
                    <Typography>更多过滤规则</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Card>
                        <Typography component="h3" align="left">
                            文件尺寸规格
                        </Typography>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                    <Card>
                        <Typography component="h3" align="left">
                            做种人数要求
                        </Typography>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                    <Card>
                        <Typography component="h3" align="left">
                            保留包含特定关键字的结果
                        </Typography>
                        <CardContent>
                            <TextField
                                type="text"
                                name="include_keyword"
                                label="保留关键字"
                                value={formik.values.include_keyword}
                                error={Boolean(formik.touched.include_keyword && formik.errors.include_keyword)}
                                fullWidth
                                helperText={formik.touched.include_keyword && formik.errors.include_keyword || (
                                    <span>
                                      只保留包含设定关键字的种子，多个关键字用英文逗号,隔开，慎用
                               </span>
                                )}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                my={3}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <Typography component="h3" align="left">
                            排除包含特定关键字的结果
                        </Typography>
                        <CardContent>
                            <TextField
                                type="text"
                                name="exclude_keyword"
                                label="排除"
                                value={formik.values.exclude_keyword}
                                error={Boolean(formik.touched.exclude_keyword && formik.errors.exclude_keyword)}
                                fullWidth
                                helperText={formik.touched.exclude_keyword && formik.errors.exclude_keyword || (
                                    <span>
                                            标题或种子名中包含任意一个关键字时排除掉，多个关键字用英文逗号,隔开
                                        </span>
                                )}
                                onBlur={formik.handleBlur}
                                onChange={formik.handleChange}
                                my={3}
                            />
                        </CardContent>
                    </Card>
                    <Card>
                        <Typography component="h3" align="left">
                            其他要求
                        </Typography>
                        <CardContent>
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
                        </CardContent>
                    </Card>
                </AccordionDetails>
            </Accordion>
            {!myRef && <Centered>
                <Button
                    sx={{mr: 2}}
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                >
                    提交
                </Button>
            </Centered>}

        </form>
    )
}

export default FilterForm;