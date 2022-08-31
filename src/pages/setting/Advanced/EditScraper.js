import React from "react";
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
    Typography
} from "@mui/material";
import {NavLink} from "react-router-dom";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import PriorityList from "@/components/PriorityList";
import {useSmartForm} from "@/components/SmartForm";

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

function EditForm({}) {
    const smartForm = useSmartForm({
        defaultValues: {
            enable_download_image: true,
            hd_poster: true,
            hd_background: false,
            langs_priority: ["zh", "en"],
            image_source: ['FanArt', 'TheMovieDB'],
            season_image_source: ['FanArt', 'TheMovieDB']
        }
    });
    const createPriorityListItems = (dataset, useValues) => {
        if (!dataset) {
            return;
        }
        if (!useValues) {
            return;
        }
        return dataset.sort((a, b) => useValues.indexOf(a.value) - useValues.indexOf(b.value)).map(item => {
            return {
                label: item.label,
                value: item.value,
                selected: useValues.includes(item.value)
            }
        });
    }
    const handlePriorityListChange = (name, items) => {
        smartForm.setFieldValue(name, items.filter(item => item.selected === true).map(item => item.value));
    }
    return (<Box sx={{p: 2}} component="form" noValidate>
        <FormControlLabel
            control={<Checkbox
                name="enable_download_image"
                checked={smartForm.values.enable_download_image}
                onChange={smartForm.handleChange}
            />}
            label="开启图片刮削（关闭后将不再自动下载图片）"
        />
        <FormControl sx={{mt: 2}} fullWidth>
            <FormLabel component="legend">电影、剧集的主要图片获取来源</FormLabel>
            <PriorityList
                items={createPriorityListItems(ImageSource, smartForm.values.image_source)}
                onChange={(items) => handlePriorityListChange('image_source', items)}
            />
            <FormHelperText>勾选表示启用，从上到下，选一个有图的来源下载</FormHelperText>
        </FormControl>
        <FormControl sx={{mt: 2}} fullWidth>
            <FormLabel component="legend">剧集季度图片获取来源</FormLabel>
            <PriorityList
                items={createPriorityListItems(SeasonImageSource, smartForm.values.season_image_source)}
                onChange={(items) => handlePriorityListChange('season_image_source', items)}
            />
            <FormHelperText>勾选表示启用，从上到下，选一个有图的来源下载</FormHelperText>
        </FormControl>
        <FormControl sx={{mt: 2}} fullWidth>
            <FormLabel component="legend">图片语言优先级</FormLabel>
            <PriorityList
                items={smartForm.values?.langs_priority?.map((value) => {
                    return {
                        label: Langs.find(item => item.value === value).label,
                        value
                    }
                })}
                onChange={(items) => smartForm.setFieldValue("langs_priority", items.map(item => item.value))}
            />
            <FormHelperText>图片上包含的文字语言选择优先级</FormHelperText>
        </FormControl>
        <FormGroup>
            <FormControlLabel
                control={<Checkbox
                    name="hd_poster"
                    checked={smartForm.values.hd_poster}
                    onChange={smartForm.handleChange}
                />}
                label="开启高清封面图（作用于下载记录、推送通知等显示）"
            />
            <FormControlLabel
                control={<Checkbox
                    name="hd_background"
                    checked={smartForm.values.hd_background}
                    onChange={smartForm.handleChange}
                />}
                label="开启高清剧照横图（作用于下载记录、推送通知等显示）"
            />
        </FormGroup>
        <Box mt={2} justifyContent={"center"}>
            <Button
                type="button"
                variant="contained"
                color="primary"
                onClick={(e) => console.log(smartForm.values)}
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