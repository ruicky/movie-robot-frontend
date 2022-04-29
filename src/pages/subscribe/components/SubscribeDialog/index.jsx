import React, {useEffect, useState} from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormHelperText,
    MenuItem,
    Select,
} from '@mui/material';
import {useAddSubscribe} from '@/utils/subscribe';
import message from "@/utils/message";
import {getFilterConfigList} from "@/api/ConfigApi";


const SubscribeDialog = ({open, handleClose, data, onComplete,filterNameList}) => {
    const [filterName, setFilterName] = useState();
    const {name, year} = data;
    const {mutateAsync: addSubscribe, isLoading} = useAddSubscribe();
    let id;
    if (data.sub_id) {
        id = data.sub_id;
    } else {
        id = data.id;
    }
    const handleSubmit = async () => {
        addSubscribe({id, filter_name: filterName}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                    if (onComplete) {
                        onComplete(0);
                    }
                    handleClose();
                } else {
                    message.error(msg);
                    handleClose();
                }
            },
            onError: error => message.error(error)
        });
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                确定要订阅 {name}{year ? "(" + year + ")" : ""} 吗？
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    <FormControl m={4} fullWidth>
                        <Select
                            name="filterName"
                            value={filterName}
                            onChange={(e) => setFilterName(e.target.value)}
                            defaultValue="system:autoSelectFilter"
                        >
                            <MenuItem value="system:autoSelectFilter">自动根据分类选择过滤器</MenuItem>
                            <MenuItem value="system:unUseFilter">不使用任何过滤器</MenuItem>
                            <Divider/>
                            {filterNameList ? filterNameList.map((value, i) => (
                                <MenuItem key={value} value={value}>{value}</MenuItem>
                            )) : <MenuItem>没有设置任何过滤器</MenuItem>}
                        </Select>
                        <FormHelperText>
                <span>
                    将按照设定的过滤器去选择资源
                </span></FormHelperText>
                    </FormControl>
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                    确定
                </Button>
                <Button onClick={handleClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SubscribeDialog;
