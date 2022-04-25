import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import {useDeleteFilterConfig} from "@/api/ConfigApi";
import message from "@/utils/message";


const DeleteDialog = ({open, handleClose, onSuccess, filterName}) => {
    const {mutate: deleteFilter, isLoading} = useDeleteFilterConfig();

    const handleSubmit = async () => {
        deleteFilter({filter_name: filterName}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(`${filterName}已经删除。`);
                    if (onSuccess) {
                        onSuccess(resData)
                    }
                    handleClose();
                } else {
                    message.error(msg);
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
        >
            <DialogTitle id="alert-dialog-title">
                {'删除提示'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    确定要删除 {filterName} 这个过滤器吗，删除后将无法恢复！
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
};

export default DeleteDialog;