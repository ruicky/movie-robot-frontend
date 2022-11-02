import React, {useContext, useEffect} from "react";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";
import {useSmartForm} from "@/components/SmartForm";
import {FormControl, FormHelperText, Grid, TextField} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
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

export function MediaStreamFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            let desc = '';
            if (filterData.media_source) {
                desc += filterData.media_source.join('/') + ' - ';
            }
            if (filterData.resolution) {
                desc += filterData.resolution.join('/') + ' - ';
            }
            if (filterData.media_codec) {
                desc += filterData.media_codec.join('/');
            }
            return desc;
        }
    }
}