import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect} from "react";
import {FormControl, FormHelperText, Grid, TextField} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const FreeTypes = [
    {
        name: "完全免费",
        value: 0
    }, {
        name: "50%下载",
        value: 0.5
    }, {
        name: "30%下载",
        value: 0.3
    }
];
const Form = ({handleClose, handleSave, data}) => {
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

export function FreeDownloadFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            let desc = '';
            if (filterData.free_type) {
                desc += filterData.free_type.map((val) => {
                    return FreeTypes.find((f) => f.value === val).name;
                }).join(" / ");
            }
            return desc;
        }
    };
}