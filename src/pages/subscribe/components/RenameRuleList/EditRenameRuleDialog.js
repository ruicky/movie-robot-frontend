import * as React from 'react';
import {useEffect, useState} from 'react';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import {DialogContent, FormControl, FormHelperText, Grid, IconButton, MenuItem, Select} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import {RenameRuleTypes} from "@/pages/subscribe/components/RenameRuleList/Rules";

const EditRenameRuleForm = (props) => {
    const {filterType} = props;
    const filter = RenameRuleTypes.find((val) => val.value === filterType).filter;
    return <filter.Form {...props}/>
}
export const EditRenameRuleDialog = ({handleSave, handleClose, open, data}) => {
    const [renameRule, setRenameRule] = useState("replaceTorrentName");
    const handleSave_ = (id, val) => {
        handleSave(id, {
            renameRuleType: renameRule,
            formData: val
        });
    }
    useEffect(() => {
        if (data?.filter_type) {
            setRenameRule(data.filter_type);
        }
    }, [data])
    return (
        <Dialog fullWidth={true} maxWidth={"sm"} open={open}>
            <DialogTitle>
                {Boolean(data && data.id) ? "编辑" : "设置"}自动重命名规则
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
                                value={renameRule}
                                onChange={(e) => setRenameRule(e.target.value)}
                                fullWidth
                                disabled={Boolean(data && data.id)}
                            >
                                {RenameRuleTypes && RenameRuleTypes.map((item) => (
                                    <MenuItem key={item.value} value={item.value}>{item.name}</MenuItem>
                                ))}
                            </Select>
                            <FormHelperText>选择一个重命名模式</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid xs={12} item>
                        <EditRenameRuleForm
                            filterType={renameRule}
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