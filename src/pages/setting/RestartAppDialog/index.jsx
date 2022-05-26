import DialogTitle from "@mui/material/DialogTitle";
import {Button, DialogActions, DialogContent, DialogContentText} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import * as React from "react";
import {useRestartApp} from "@/api/CommonApi";
import message from "@/utils/message";

function RestartAppDialog({open, handleClose}) {
    const {mutateAsync: restartApp} = useRestartApp()
    const onRestartApp = () => {
        restartApp({}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg);
                    handleClose();
                } else {
                    message.error(msg)
                }
            }
        })
    }
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle id="alert-dialog-title">
                {'操作提示'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    确定要立即重新启动应用程序吗？
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={onRestartApp}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default RestartAppDialog;