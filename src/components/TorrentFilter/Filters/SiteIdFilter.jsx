import React, {useContext, useEffect} from "react";
import {useSmartForm} from "@/components/SmartForm";
import {FormControl, FormHelperText, Grid, TextField} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";

const Form = ({handleClose, handleSave, data}) => {
    const filterOptions = useContext(FilterOptionsContext);
    const {
        site_list: siteData
    } = filterOptions;

    const smartForm = useSmartForm({
        initValues: {
            site_id: []
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {site_id} = data.filter_data;
        smartForm.setFieldValue('site_id', site_id ? site_id : []);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <FormControl m={4} fullWidth>
                        <Autocomplete
                            multiple
                            getOptionLabel={(option) => option.name}
                            value={siteData.filter((item) => {
                                return smartForm.values.site_id.includes(item.value);
                            })}
                            options={siteData}
                            renderInput={(params) => <TextField {...params} placeholder="站点"/>}
                            onChange={(e, val) => smartForm.setFieldValue('site_id', val.map((item) => {
                                return item.value
                            }))}
                        />
                        <FormHelperText>
                            想要的站点，可留空，多个为或
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

export function SiteIdFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            const {site_list: siteList} = options;
            let desc = '';
            if (siteList && siteList.length > 0) {
                desc += filterData.site_id.map((val) => {
                    return siteList.find((item) => item.value === val)?.name;
                }).join(' / ');
                return desc;
            } else {
                if (filterData.site_id) {
                    desc += filterData.site_id.join(' / ');
                }
                return desc;
            }
        }
    }
}