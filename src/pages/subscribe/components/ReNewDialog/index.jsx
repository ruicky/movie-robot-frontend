import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import {useReNewSubscribe} from '@/utils/subscribe';
import message from "@/utils/message";


const ReNewDialog = ({open, handleClose, data, onComplete}) => {
    const {id, name, year, sub_id} = data;
    const {mutateAsync: reNewSubscribe, isLoading} = useReNewSubscribe();

    const handleSubmit = async () => {
        reNewSubscribe({id: sub_id}, {
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
                洗版
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {`确定要重新开启订阅${name}（${year}）吗？（暂时只是开启订阅可以再次被智能下载。真正的洗版开发中，敬请期待）`}
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

export default ReNewDialog;
