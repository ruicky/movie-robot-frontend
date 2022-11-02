import React, {useContext, useEffect} from "react";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";
import {useSmartForm} from "@/components/SmartForm";
import {FormControl, FormHelperText, Grid, TextField} from "@mui/material";
import {Autocomplete} from "@mui/lab";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
    const filterOptions = useContext(FilterOptionsContext);
    const {
        release_team
    } = filterOptions;
    const smartForm = useSmartForm({
        initValues: {
            release_team: []
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {release_team} = data.filter_data;
        smartForm.setFieldValue('release_team', release_team);
    }, [data]);
    return (
        <>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                    <FormControl m={4} fullWidth>
                        <Autocomplete
                            multiple
                            options={release_team}
                            renderInput={(params) => <TextField {...params} placeholder="制作组"/>}
                            value={smartForm.values.release_team}
                            onChange={(e, val) => smartForm.setFieldValue('release_team', val)}
                        />
                        <FormHelperText>
                            想要的制作组，可留空，多个为或
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

export function ReleaseTeamFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            let desc = '';
            if (filterData.release_team) {
                desc += filterData.release_team.join(' / ');
            } else {
                desc = '未指定'
            }
            return desc;
        }

    }
}