import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import {useAddSubscribe} from '@/utils/subscribe';
import message from "@/utils/message";


const SubscribeDialog = ({open, handleClose, data, onComplete}) => {
    const {id, name, year} = data;
    const {mutateAsync: addSubscribe, isLoading} = useAddSubscribe();

    const handleSubmit = async () => {
        addSubscribe({id}, {
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

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                提交订阅
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`确定要订阅 ${name}（${year}） 吗？订阅后将立即开始下载！`}
                </DialogContentText>
            </DialogContent>
            <DialogActions>、
                <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                    确定
                </Button>
                <Button onClick={handleClose}>取消</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SubscribeDialog;
