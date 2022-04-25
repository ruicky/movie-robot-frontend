import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton,} from '@mui/material';
import FilterForm from "@/components/Selectors/FilterForm";
import {getFilterOptions} from "@/api/CommonApi";
import {useReVersionSubscribe} from "@/utils/subscribe";
import message from "@/utils/message";
import CloseIcon from '@mui/icons-material/Close';


const ReNewDialog = ({open, handleClose, data, onComplete, renewFormData}) => {
    const {mutateAsync: reNewSub, isLoading} = useReVersionSubscribe()
    const {name, year, sub_id} = data;
    const [filterOptions, setFilterOptions] = useState();
    const onSubmit = async (values, setErrors) => {
        values['sub_id'] = sub_id;
        reNewSub(values, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                    if (onComplete) {
                        onComplete(2);
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
        if (open) {
            const filterOptions = await getFilterOptions()
            setFilterOptions(filterOptions)
        }
    }, [open])
    return (
        <Dialog
            open={open}
            onClose={() => handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            fullWidth={true}
            maxWidth="md"
        >
            <DialogTitle id="alert-dialog-title">
                {name}({year})洗版规格设置
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
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <FilterForm
                    onSubmit={onSubmit}
                    showFilterName={false}
                    showApplyInfo={false}
                    showSubmit={true}
                    formValues={renewFormData}
                    filterOptions={filterOptions}
                />
            </DialogContent>
        </Dialog>
    );
}

export default ReNewDialog;
