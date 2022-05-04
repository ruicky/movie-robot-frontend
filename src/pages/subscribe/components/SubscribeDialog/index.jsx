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
import FilterForm from "@/components/Selectors/FilterForm";
import {getFilterOptions} from "@/api/CommonApi";


const SubscribeDialog = ({open, handleClose, data, onComplete, filterNameList}) => {
    const [filterName, setFilterName] = useState();
    const [formValues, setFormValues] = useState();
    const [filterOptions, setFilterOptions] = useState();
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
    useEffect(async () => {
        const filterOptions = await getFilterOptions()
        setFilterOptions(filterOptions)
    }, [])
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
                            <MenuItem value="system:autoSelectFilter">自动选择过滤器</MenuItem>
                            <MenuItem value="system:unUseFilter">不使用任何过滤器</MenuItem>
                            <MenuItem value="system:newFilter">独立设置过滤器</MenuItem>
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
                    {filterName === 'system:newFilter' &&
                    <FilterForm showFilterName={false} showApplyInfo={false} formValues={formValues} filterOptions={filterOptions} onSubmit={null}/>}
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
