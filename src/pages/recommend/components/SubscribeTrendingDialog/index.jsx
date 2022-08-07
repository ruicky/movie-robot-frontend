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
import {useSubDataset} from '@/utils/subscribe';
import FilterForm from "@/components/Selectors/FilterForm";
import {FilterOptionsContext} from "@/components/Selectors/FilterOptionsProvider";
import TextField from "@mui/material/TextField";
import message from "@/utils/message";


const SubscribeTrendingDialog = ({open, handleClose, data, onComplete}) => {
    const filterOptionsContextData = useContext(FilterOptionsContext)
    const myRef = useRef(null);
    const [rating, setRating] = useState(8.5);
    const [filterName, setFilterName] = useState();
    const [showFilterForm, setShowFilterForm] = useState(false);
    const {trendingType, trendingName} = data;
    const {mutateAsync: sub, isLoading} = useSubDataset();
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
        }
        sub({
            name: trendingName,
            data_type:'Trending',
            data_key: trendingType,
            filter_name: filterName,
            rating: rating,
            filter_config: filterConfig
        }, {
            onSuccess: res => {
                const {code, message: msg} = res;
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
        })
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
                确定要订阅 {trendingName} 吗？
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    订阅榜单后，只要榜单出现新增影片，并且符合你设定的条件，就会自动提交订阅并发送通知。
                </DialogContentText>
                <TextField
                    autoFocus
                    margin="dense"
                    id="rating"
                    label="最低分数"
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    fullWidth
                />
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
                    自动订阅时会按此过滤器提交
                </span></FormHelperText>
                </FormControl>
                {showFilterForm &&
                <FilterForm showFilterName={false} showApplyInfo={false} showFilterTemplate={true}
                            filterOptions={filterOptionsContextData} onSubmit={null} myRef={myRef}/>}
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

export default SubscribeTrendingDialog;
