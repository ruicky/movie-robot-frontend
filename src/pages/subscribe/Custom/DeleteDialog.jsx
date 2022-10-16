import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import message from "@/utils/message";
import {useDeleteSubCustom} from "@/utils/subscribe";


const DeleteDialog = ({open, handleClose, onSuccess, id, filterName}) => {
    const {mutate: deleteFilter, isLoading} = useDeleteSubCustom();

    const handleSubmit = async () => {
        deleteFilter({id}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
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
                    确定要删除 {filterName} 这个自定义订阅吗，删除后将无法恢复！
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
};

export default DeleteDialog;