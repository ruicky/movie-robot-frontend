import * as React from 'react';
import {useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogContent, FormControl, FormHelperText, Grid, IconButton, MenuItem, Select} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {FilterTypes} from "@/components/TorrentFilter/Filters";

const EditFilterForm = (props) => {
    const {filterType} = props;
    const filter = FilterTypes.find((val) => val.value === filterType).filter;
    return <filter.Form {...props}/>
}
export const EditFilterDialog = ({handleSave, handleClose, open, data}) => {
    const [filterType, setFilterType] = useState("torrentName");
    const handleSave_ = (id, val) => {
        handleSave(id, {
            filter_type: filterType,
            filter_data: val
        });
    }
    useEffect(() => {
        if (data?.filter_type) {
            setFilterType(data.filter_type);
        }
    }, [data])
    return (
        <Dialog fullWidth={true} maxWidth={"sm"} open={open}>
            <DialogTitle>
                {Boolean(data && data.id) ? "编辑" : "设置"}过滤器
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <Grid spacing={4} container>
                    <Grid xs={12} item>
                        <FormControl fullWidth>
                            <Select
                                name="filter_type"
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                fullWidth
                                disabled={Boolean(data && data.id)}
                            >
                                {FilterTypes && FilterTypes.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>选择一个过滤器类型</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} item>
                        <EditFilterForm
                            filterType={filterType}
                            handleClose={handleClose}
                            handleSave={handleSave_}
                            data={data}
                        />
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
}