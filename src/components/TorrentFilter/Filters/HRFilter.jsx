import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect} from "react";
import {Grid, TextField} from "@mui/material";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
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

export function HRFilter() {
    return {
        Form,
        preview: (filterData,options) => {
            let desc = '';
            if (filterData.hr_days === 0) {
                desc += "排除需要H&R的种子"
            } else {
                desc += `排除 H&R时间 > ${filterData.hr_days}天 的种子`;
            }
            return desc;
        }
    }
}