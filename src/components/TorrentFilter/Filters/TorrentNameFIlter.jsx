import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect} from "react";
import {FormControl, FormHelperText, Grid, MenuItem, Select, TextField} from "@mui/material";
import {FormActions} from "@/components/TorrentFilter/components/FormActions";

const Form = ({handleClose, handleSave, data}) => {
    const smartForm = useSmartForm({
        initValues: {
            mode: "include",
            logic: "and",
            torrent_name: ''
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {mode, logic, torrent_name} = data.filter_data;
        smartForm.setFieldValue('mode', mode);
        smartForm.setFieldValue('logic', logic);
        smartForm.setFieldValue('torrent_name', torrent_name);
    }, [data])
    return (
        <>
            <Grid container spacing={4}>
                <Grid xs={12} item>
                    <FormControl fullWidth>
                        <Select
                            name="mode"
                            value={smartForm.values.mode}
                            onChange={smartForm.handleChange}
                            fullWidth
                        >
                            <MenuItem value={"include"}>匹配存在设定关键字的种子</MenuItem>
                            <MenuItem value={"exclude"}>排除掉存在设定关键字的种子</MenuItem>
                        </Select>
                        <FormHelperText>匹配关键字的模式</FormHelperText>
                    </FormControl>
                </Grid>
                <Grid xs={9} md={10} item>
                    <TextField
                        type="text"
                        name="torrent_name"
                        label="关键字"
                        helperText={"多个用英文逗号,隔开"}
                        fullWidth
                        my={3}
                        value={smartForm.values.torrent_name}
                        onChange={smartForm.handleChange}
                    />
                </Grid>
                <Grid xs={3} md={2} item>
                    <FormControl fullWidth>
                        <Select
                            name="logic"
                            value={smartForm.values.logic}
                            onChange={smartForm.handleChange}
                            fullWidth
                        >
                            <MenuItem value={"and"}>并且</MenuItem>
                            <MenuItem value={"or"}>或者</MenuItem>
                        </Select>
                        <FormHelperText>条件</FormHelperText>
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

export function TorrentNameFilter() {
    return {
        Form,
        preview: (filterData, options) => {
            return `${filterData.mode === 'include' ? "匹配" : "排除"}模式 条件：${filterData.logic === 'and' ? "并且" : "或者"} 关键字：${filterData.torrent_name}`;
        }
    }
}