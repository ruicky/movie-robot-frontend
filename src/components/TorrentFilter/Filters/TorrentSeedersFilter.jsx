import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect} from "react";
import {Grid, TextField} from "@mui/material";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
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

export function TorrentSeedersFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            let desc = '';
            if (filterData.min_seeders !== 0) {
                desc += "做种 >= " + filterData.min_seeders;
            }
            if (filterData.max_seeders !== 0) {
                if (desc !== '') {
                    desc += " 并且 "
                }
                desc += "做种 <= " + filterData.max_seeders;
            }
            return desc;
        }
    }
}