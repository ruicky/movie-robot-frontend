import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect} from "react";
import {Grid, TextField} from "@mui/material";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
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

export function FileSizeFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            let desc = '';
            if (filterData.min_size !== 0) {
                desc += "尺寸 >= " + filterData.min_size + "MB";
            }
            if (filterData.max_size !== 0) {
                if (desc !== '') {
                    desc += " 并且 "
                }
                desc += "尺寸 <= " + filterData.max_size + "MB";
            }
            return desc;
        }
    };
}