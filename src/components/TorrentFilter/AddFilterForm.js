import {useSmartForm} from "@/components/SmartForm";
import {
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Stack,
    TextField
} from "@mui/material";
import React, {useContext, useEffect} from "react";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";
import {Autocomplete} from "@mui/lab";

const FormActions = ({handleClose, handleSave}) => {
    return (
        <Stack direction="row" spacing={2} justifyContent={"right"}>
            <Button
                mr={2}
                size="small"
                color="secondary"
                onClick={handleClose}
            >
                取消
            </Button>
            <Button
                mr={2}
                size="small"
                onClick={handleSave}
            >
                保存
            </Button>
        </Stack>);
}
const TorrentNameFilterForm = ({handleClose, handleSave, data}) => {
    const smartForm = useSmartForm({
        initValues: {
            logic: "and",
            torrent_name: ''
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {logic, torrent_name} = data.filter_data;
        smartForm.setFieldValue('logic', logic);
        smartForm.setFieldValue('torrent_name', torrent_name);
    }, [data])
    return (
        <>
            <Grid container spacing={4}>
                <Grid xs={3} md={2} item>
                    <FormControl fullWidth>
                        <Select
                            name="logic"
                            value={smartForm.values.logic}
                            onChange={smartForm.handleChange}
                            fullWidth
                        >
                            <MenuItem value={"and"}>并且</MenuItem>
                            <MenuItem value={"or"}>或者</MenuItem>
                        </Select>
                        <FormHelperText>条件</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={9} md={10} item>
                    <TextField
                        type="text"
                        name="torrent_name"
                        label="关键字"
                        helperText={"多个用英文逗号,隔开"}
                        fullWidth
                        my={3}
                        value={smartForm.values.torrent_name}
                        onChange={smartForm.handleChange}
                    />
                </Grid>
            </Grid>
            <FormActions
                handleClose={handleClose}
                handleSave={() => handleSave(data?.id, smartForm.values)}
            />
        </>
    );
}
const FileSizeFilterForm = ({handleClose, handleSave, data}) => {
    const smartForm = useSmartForm({
        initValues: {
            min_size: 0,
            max_size: 0
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {min_size, max_size} = data.filter_data;
        smartForm.setFieldValue('min_size', min_size);
        smartForm.setFieldValue('max_size', max_size);
    }, [data])
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={6} md={6}>
                    <TextField
                        type="number"
                        name="min_size"
                        label="最小尺寸"
                        value={smartForm.values.min_size}
                        fullWidth
                        helperText={"文件尺寸下限，单位MB，留0为不限制"}
                        onChange={smartForm.handleChange}
                        my={3}
                    />
                </Grid>
                <Grid item xs={6} md={6}>
                    <TextField
                        type="number"
                        name="max_size"
                        label="最大尺寸"
                        value={smartForm.values.max_size}
                        fullWidth
                        helperText={"文件尺寸上限，单位MB，留0为不限制"}
                        onChange={smartForm.handleChange}
                        my={3}
                    />
                </Grid>
            </Grid>
            <FormActions
                handleClose={handleClose}
                handleSave={() => handleSave(data?.id, smartForm.values)}
            />
        </>
    );
}
const MediaStreamFilterForm = ({handleClose, handleSave, data}) => {
    const filterOptions = useContext(FilterOptionsContext);

    const {
        media_source: mediaSource,
        resolution,
        media_codec: mediaCodec
    } = filterOptions;
    const smartForm = useSmartForm({
        initValues: {
            media_source: [],
            resolution: [],
            media_codec: []
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {media_source, resolution, media_codec} = data.filter_data;
        smartForm.setFieldValue('media_source', media_source);
        smartForm.setFieldValue('resolution', resolution);
        smartForm.setFieldValue('media_codec', media_codec);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <FormControl m={4} fullWidth>
                        <Autocomplete
                            multiple
                            options={mediaSource}
                            renderInput={(params) => <TextField {...params} placeholder="媒体来源"/>}
                            value={smartForm.values.media_source}
                            onChange={(e, val) => smartForm.setFieldValue('media_source', val)}
                        />
                        <FormHelperText>
                            想要的媒体来源，可留空，多个为或
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl m={4} fullWidth>
                        <Autocomplete
                            multiple
                            options={resolution}
                            renderInput={(params) => <TextField {...params} placeholder="分辨率"/>}
                            value={smartForm.values.resolution}
                            onChange={(e, val) => smartForm.setFieldValue('resolution', val)}
                        />
                        <FormHelperText>
                            想要的分辨率，可留空，多个为或
                        </FormHelperText>
                    </FormControl>
                </Grid>
                <Grid item xs={12}>
                    <FormControl m={4} fullWidth>
                        <Autocomplete
                            multiple
                            options={mediaCodec}
                            renderInput={(params) => <TextField {...params} placeholder="编码"/>}
                            value={smartForm.values.media_codec}
                            onChange={(e, val) => smartForm.setFieldValue('media_codec', val)}
                        />
                        <FormHelperText>
                            想要的编码类型，可留空，多个为或
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
            <FormActions
                handleClose={handleClose}
                handleSave={() => handleSave(data?.id, smartForm.values)}
            />
        </>
    );
}

const TorrentSeedersFilterForm = ({handleClose, handleSave, data}) => {
    const smartForm = useSmartForm({
        initValues: {
            min_seeders: 0,
            max_seeders: 0
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {min_seeders, max_seeders} = data.filter_data;
        smartForm.setFieldValue('min_seeders', min_seeders);
        smartForm.setFieldValue('max_seeders', max_seeders);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={6} md={6}>
                    <TextField
                        type="number"
                        name="min_seeders"
                        label="最小做种人数"
                        value={smartForm.values.min_seeders}
                        fullWidth
                        helperText={"最小做种人数，留0为不限制"}
                        onChange={smartForm.handleChange}
                        my={3}
                    />
                </Grid>
                <Grid item xs={6} md={6}>
                    <TextField
                        type="number"
                        name="max_seeders"
                        label="最大做种人数"
                        value={smartForm.values.max_seeders}
                        fullWidth
                        helperText={"最大做种人数，留0为不限制"}
                        onChange={smartForm.handleChange}
                        my={3}
                    />
                </Grid>
            </Grid>
            <FormActions
                handleClose={handleClose}
                handleSave={() => handleSave(data?.id, smartForm.values)}
            />
        </>
    );
}


const SubtitleFilterForm = ({handleClose, handleSave, data}) => {
    const smartForm = useSmartForm({
        initValues: {
            has_cn: false,
            has_special: false
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {has_cn, has_special} = data.filter_data;
        smartForm.setFieldValue('has_cn', has_cn);
        smartForm.setFieldValue('has_special', has_special);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={6} md={6}>
                    <FormControlLabel
                        control={<Checkbox
                            checked={smartForm.values.has_cn}
                            name="has_cn"
                            onChange={smartForm.handleChange}
                        />}
                        label="必须有中文字幕"
                    />
                </Grid>
                <Grid item xs={6} md={6}>
                    <FormControlLabel
                        control={<Checkbox
                            checked={smartForm.values.has_special}
                            name="has_special"
                            onChange={smartForm.handleChange}
                        />}
                        label="必须是特效字幕"
                    />
                </Grid>
            </Grid>
            <FormActions
                handleClose={handleClose}
                handleSave={() => handleSave(data?.id, smartForm.values)}
            />
        </>
    );
}

const FreeDownloadFilterForm = ({handleClose, handleSave, data}) => {
    const FreeTypes = [
        {
            name: "免费",
            value: 0
        }, {
            name: "50%下载",
            value: 0.5
        }, {
            name: "30%下载",
            value: 0.3
        }
    ];
    const smartForm = useSmartForm({
        initValues: {
            free_type: []
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {free_type} = data.filter_data;
        smartForm.setFieldValue('free_type', free_type);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <FormControl m={4} fullWidth>
                        <Autocomplete
                            multiple
                            getOptionLabel={(option) => option.name}
                            value={FreeTypes.filter((item) => {
                                return smartForm.values.free_type.includes(item.value)
                            })}
                            options={FreeTypes}
                            renderInput={(params) => <TextField {...params} placeholder="下载折扣"/>}
                            onChange={(e, val) => smartForm.setFieldValue('free_type', val.map((item) => {
                                return item.value
                            }))}
                        />
                        <FormHelperText>
                            想要的下载折扣，留空不限制，多选为或
                        </FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
            <FormActions
                handleClose={handleClose}
                handleSave={() => handleSave(data?.id, smartForm.values)}
            />
        </>
    );
}

const HRFilterForm = ({handleClose, handleSave, data}) => {
    const smartForm = useSmartForm({
        initValues: {
            hr_days: 0
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {hr_days} = data.filter_data;
        smartForm.setFieldValue('hr_days', hr_days);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        name="hr_days"
                        label="允许H&R天数大于等于"
                        value={smartForm.values.hr_days}
                        fullWidth
                        helperText={"0为不接受任何需要H&R的种子，3为接受做种3天的"}
                        onChange={smartForm.handleChange}
                        my={3}
                    />
                </Grid>
            </Grid>
            <FormActions
                handleClose={handleClose}
                handleSave={() => handleSave(data?.id, smartForm.values)}
            />
        </>
    );
}
export const AddFilterForm = (props) => {
    const {filterType} = props;
    switch (filterType) {
        case "torrentName":
            return <TorrentNameFilterForm {...props}/>;
        case "fileSize":
            return <FileSizeFilterForm {...props}/>;
        case "mediaStream":
            return <MediaStreamFilterForm {...props}/>;
        case "torrentSeeders":
            return <TorrentSeedersFilterForm {...props}/>;
        case "subtitle":
            return <SubtitleFilterForm {...props}/>;
        case "freeDownload":
            return <FreeDownloadFilterForm {...props}/>
        case "torrentHR":
            return <HRFilterForm {...props}/>
        default:
            return null;
    }
}