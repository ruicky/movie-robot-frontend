import React, {useEffect} from "react";
import {Helmet} from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Button,
    Checkbox,
    Divider as MuiDivider,
    FormControl,
    FormControlLabel,
    FormGroup,
    FormHelperText,
    FormLabel,
    Link,
    TextField,
    Typography
} from "@mui/material";
import {NavLink, useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import PriorityList from "@/components/PriorityList";
import {useSmartForm} from "@/components/SmartForm";
import {useGetScraper} from "@/api/SettingApi";
import {useSaveScraper} from "../../../api/SettingApi";
import message from "../../../utils/message";

const Divider = styled(MuiDivider)(spacing);
const ImageSource = [
    {label: "FanArt", value: "FanArt", selected: true},
    {
        label: "TheMovieDB",
        value: "TheMovieDB",
        selected: true
    }
]
const SeasonImageSource = [
    {label: "FanArt", value: "FanArt", selected: true},
    {
        label: "TheMovieDB",
        value: "TheMovieDB",
        selected: true
    }
]
const Langs = [
    {label: "中文", value: "zh"},
    {
        label: "英文",
        value: "en"
    }
]
const createPriorityListItems = (dataset, useValues) => {
    if (!dataset) {
        return;
    }
    if (!useValues) {
        return;
    }
    return dataset.sort((a, b) => {
        const aIdx = useValues.indexOf(a.value);
        const bIdx = useValues.indexOf(b.value);
        if(aIdx===-1||bIdx===-1){
            return 0;
        }
        return aIdx - bIdx;
    }).map(item => {
        return {
            label: item.label,
            value: item.value,
            selected: useValues.includes(item.value)
        }
    });
}

function EditForm({}) {
    const navigate = useNavigate();
    const smartForm = useSmartForm({
        initValues: {
            generate_nfo: true,
            enable_download_image: true,
            use_cn_person_name: true,
            person_nfo_path: '',
            hd_poster: true,
            hd_background: false,
            langs_priority: ["zh", "en"],
            image_source: ['FanArt', 'TheMovieDB'],
            season_image_source: ['FanArt', 'TheMovieDB']
        }
    });
    const {data: config} = useGetScraper();
    const {mutate: saveConfig} = useSaveScraper();
    const handlePriorityListChange = (name, items) => {
        smartForm.setFieldValue(name, items.filter(item => item.selected === true).map(item => item.value));
    }
    const onSave = () => {
        saveConfig(smartForm.values, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success('刮削设置保存成功，已经生效了。')
                } else {
                    message.error(msg)
                }
            }
        });
    }
    useEffect(() => {
        if (!config || !config?.data) {
            return;
        }
        Object.keys(config.data).forEach((key) => {
            smartForm.setFieldValue(key, config.data[key]);
        });
    }, [config])
    return (<Box component="form" noValidate>
        <FormControl sx={{m: 2}} component="fieldset" fullWidth>
            <FormLabel component="legend">开关设置</FormLabel>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox
                        name="generate_nfo"
                        checked={smartForm.values.generate_nfo}
                        onChange={smartForm.handleChange}
                    />}
                    label="生成NFO文件（关闭后图片也将禁用）"
                />
                <FormControlLabel
                    control={<Checkbox
                        name="enable_download_image"
                        disabled={!smartForm.values.generate_nfo}
                        checked={smartForm.values.generate_nfo && smartForm.values.enable_download_image}
                        onChange={smartForm.handleChange}
                    />}
                    label="开启图片刮削（关闭后将不再自动下载图片）"
                />
            </FormGroup>
            <FormHelperText>不建议关闭</FormHelperText>
        </FormControl>
        <FormControl sx={{m: 2}} component="fieldset" fullWidth>
            <FormLabel component="legend">影片元数据详细设置</FormLabel>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox
                        name="use_cn_person_name"
                        checked={smartForm.values.use_cn_person_name}
                        onChange={smartForm.handleChange}
                    />}
                    label="使用中文演员信息（关闭后生成的剧组人员信息为英文信息）"
                />
                <TextField
                    disabled={!smartForm.values.use_cn_person_name}
                    type="text"
                    variant="standard"
                    name="person_nfo_path"
                    label="人员数据NFO和图片目录"
                    value={smartForm.values.person_nfo_path}
                    onChange={smartForm.handleChange}
                    fullWidth
                    helperText={<span>
                    使用中文演员必配置，在Emby的元数据目录，不知道在哪可以查看教程：<Link target="_blank"
                                                            href="https://yee329.notion.site/3ee81beea46b45aa9bd98f619c04dca3">
                    学习如何查找
                </Link>
                </span>}
                />
            </FormGroup>
        </FormControl>
        <FormControl sx={{mt: 2, m: 2}} fullWidth>
            <FormLabel component="legend">电影、剧集的主要图片获取来源</FormLabel>
            <PriorityList
                items={createPriorityListItems(ImageSource, smartForm.values.image_source)}
                onChange={(items) => handlePriorityListChange('image_source', items)}
            />
            <FormHelperText>勾选表示启用，从上到下，选一个有图的来源下载</FormHelperText>
        </FormControl>
        <FormControl sx={{mt: 2, m: 2}} fullWidth>
            <FormLabel component="legend">剧集季度图片获取来源</FormLabel>
            <PriorityList
                items={createPriorityListItems(SeasonImageSource, smartForm.values.season_image_source)}
                onChange={(items) => handlePriorityListChange('season_image_source', items)}
            />
            <FormHelperText>勾选表示启用，从上到下，选一个有图的来源下载</FormHelperText>
        </FormControl>
        <FormControl sx={{mt: 2, m: 2}} fullWidth>
            <FormLabel component="legend">图片语言优先级</FormLabel>
            <PriorityList
                items={smartForm.values.langs_priority.map((value) => {
                    return {
                        label: Langs.find(item => item.value === value).label,
                        value
                    }
                })}
                onChange={(items) => smartForm.setFieldValue("langs_priority", items.map(item => item.value))}
            />
            <FormHelperText>图片上包含的文字语言选择优先级</FormHelperText>
        </FormControl>
        <FormControl sx={{mt: 2, m: 2}} fullWidth>
            <FormLabel component="legend">其他与刮削有关的设置</FormLabel>
            <FormGroup>
                <FormControlLabel
                    control={<Checkbox
                        name="hd_poster"
                        checked={smartForm.values.hd_poster}
                        onChange={smartForm.handleChange}
                    />}
                    label="使用高清封面图（作用于下载记录、推送通知等显示）"
                />
                <FormControlLabel
                    control={<Checkbox
                        name="hd_background"
                        checked={smartForm.values.hd_background}
                        onChange={smartForm.handleChange}
                    />}
                    label="使用高清剧照横图（作用于下载记录、推送通知等显示）"
                />
            </FormGroup>
        </FormControl>
        <Box mt={2} justifyContent={"center"}>
            <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={onSave}
                fullWidth
            >
                保存
            </Button>
        </Box>
    </Box>);
}

const EditScraper = () => {
    return (<React.Fragment>
        <Helmet title="全局刮削设置"/>
        <Typography variant="h3" gutterBottom display="inline">
            全局刮削设置
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>全局刮削设置</Typography>
        </Breadcrumbs>
        <Divider my={2}/>
        <EditForm/>
    </React.Fragment>);
}
export default EditScraper;