import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect} from "react";
import {Grid, TextField} from "@mui/material";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
    const smartForm = useSmartForm({
        initValues: {
            last_minutes: 0
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {last_minutes} = data.filter_data;
        smartForm.setFieldValue('last_minutes', last_minutes !== null && last_minutes !== undefined ? last_minutes : 0);
    }, [data])
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <TextField
                        type="number"
                        name="last_minutes"
                        label="最近N分钟"
                        value={smartForm.values.last_minutes}
                        fullWidth
                        helperText={"种子发布时间距离当前的分钟数，0为不限制，单位分钟"}
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

export function PublishDateFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            if (filterData.last_minutes === 0) {
                return "不限制";
            }
            return `最近${filterData.last_minutes}分钟发布的种子`;
        }
    };
}