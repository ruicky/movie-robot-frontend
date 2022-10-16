import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect} from "react";
import {Checkbox, FormControlLabel, Grid} from "@mui/material";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
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

export function SubtitleFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            let desc = '';
            if (filterData.has_cn) {
                desc += "必须包含中文字幕";
            }
            if (filterData.has_special) {
                if (desc !== '') {
                    desc += " 并且 ";
                }
                desc += "必须包含特效字幕";
            }
            return desc;
        }
    }
}