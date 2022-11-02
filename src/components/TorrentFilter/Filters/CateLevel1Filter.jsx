import React, {useContext, useEffect} from "react";
import {useSmartForm} from "@/components/SmartForm";
import {FormControl, FormHelperText, Grid, TextField} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";

const Form = ({handleClose, handleSave, data}) => {
    const filterOptions = useContext(FilterOptionsContext);
    const {
        cate_level1_list: cateLevel1List
    } = filterOptions;

    const smartForm = useSmartForm({
        initValues: {
            cate_level1: []
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {cate_level1} = data.filter_data;
        smartForm.setFieldValue('cate_level1', cate_level1 ? cate_level1 : []);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <FormControl m={4} fullWidth>
                        <Autocomplete
                            multiple
                            getOptionLabel={(option) => option.name}
                            value={cateLevel1List.filter((item) => {
                                return smartForm.values.cate_level1.includes(item.value);
                            })}
                            options={cateLevel1List}
                            renderInput={(params) => <TextField {...params} placeholder="分类"/>}
                            onChange={(e, val) => smartForm.setFieldValue('cate_level1', val.map((item) => {
                                return item.value
                            }))}
                        />
                        <FormHelperText>
                            想要的种子所属分类，留空为所有
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

export function CateLevel1() {
    return {
        Form,
        preview: (filterData, options) => {
            const {cate_level1_list: cateLevel1List} = options;
            let desc = '';
            if (cateLevel1List && cateLevel1List.length > 0) {
                desc += filterData.cate_level1.map((val) => {
                    return cateLevel1List.find((item) => item.value === val).name;
                }).join(' / ');
                return desc;
            } else {
                if (filterData.cate_level1) {
                    desc += filterData.cate_level1.join(' / ');
                }
                return desc;
            }
        }
    }
}