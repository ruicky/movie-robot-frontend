import React, {useContext, useRef, useState} from 'react';
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
import {FilterOptionsContext} from "@/components/Selectors/FilterOptionsProvider";


const SubscribeDialog = ({open, handleClose, data, onComplete}) => {
    const filterOptionsContextData = useContext(FilterOptionsContext)
    const myRef = useRef(null);
    const [filterName, setFilterName] = useState();
    const [showFilterForm, setShowFilterForm] = useState(false);
    const {name, year} = data;
    const {mutateAsync: addSubscribe, isLoading} = useAddSubscribe();
    let id;
    if (data.sub_id) {
        id = data.sub_id;
    } else {
        id = data.id;
    }
    const onChange = (e) => {
        setFilterName(e.target.value)
        if (e.target.value === 'system:newFilter') {
            setShowFilterForm(true)
        } else {
            setShowFilterForm(false)
        }
    }
    const handleSubmit = async () => {
        let filterConfig;
        if (filterName && filterName === 'system:newFilter') {
            await myRef.current.onSubmit()
            filterConfig = await myRef.current.getVal()
            console.log('filterConfig', filterConfig)
        }
        addSubscribe({id, filter_name: filterName, filter_config: filterConfig}, {
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
            maxWidth="md"
            fullWidth={showFilterForm}
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
                            onChange={onChange}
                            defaultValue="system:autoSelectFilter"
                        >
                            <MenuItem value="system:autoSelectFilter">自动选择过滤器</MenuItem>
                            <MenuItem value="system:unUseFilter">不使用任何过滤器</MenuItem>
                            <MenuItem value="system:newFilter">独立设置过滤器</MenuItem>
                            <Divider/>
                            {filterOptionsContextData?.filter_name_list ? filterOptionsContextData?.filter_name_list.map((value, i) => (
                                <MenuItem key={value} value={value}>{value}</MenuItem>
                            )) : <MenuItem>没有设置任何过滤器</MenuItem>}
                        </Select>
                        <FormHelperText>
                <span>
                    将按照设定的过滤器去选择资源
                </span></FormHelperText>
                    </FormControl>
                    {showFilterForm &&
                    <FilterForm showFilterName={false} showApplyInfo={false} showFilterTemplate={true}
                                filterOptions={filterOptionsContextData} onSubmit={null} myRef={myRef}/>}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default SubscribeDialog;
