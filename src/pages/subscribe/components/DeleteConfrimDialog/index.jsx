import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import {useDeleteSubscribe} from '@/utils/subscribe';
import message from "@/utils/message";


const DeleteConfrimDialog = ({open, handleClose, data, onComplete}) => {
    const {id, name, year, sub_id} = data;
    const {mutate: deleteSubscribe, isLoading} = useDeleteSubscribe();

    const handleSubmit = async () => {
        deleteSubscribe({id: sub_id}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(`${name}已经取消订阅。`);
                    if (onComplete) {
                        onComplete(2);
                    }
                    handleClose();
                } else {
                    message.error(msg);
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
                {'删除提示'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`确定要取消 ${name}(${year}) 的订阅吗？`}
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

export default DeleteConfrimDialog;