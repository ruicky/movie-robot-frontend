import React from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import {useReNewSubscribe} from '@/utils/subscribe';
import message from "@/utils/message";


const ReNewDialog = ({open, handleClose, data, onComplete}) => {
    const {name, year} = data;
    const {mutateAsync: reNewSubscribe, isLoading} = useReNewSubscribe();
    let id;
    if (data.sub_id) {
        id = data.sub_id;
    } else {
        id = data.id;
    }
    const handleSubmit = async () => {
        reNewSubscribe({id}, {
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
                    确定要立即重新下载 {name}{year ? "(" + year + ")" : ""} 吗？
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

export default ReNewDialog;
