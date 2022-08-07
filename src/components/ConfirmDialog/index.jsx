import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React from "react";

function ConfirmDialog({children, open, onClose, onOk, title = "操作提示", content = null}) {
    return (
        <Dialog
            open={open}
            onClose={() => onClose()}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    {content}
                </DialogContentText>
                {children}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => onClose()}>取消</Button>
                <Button onClick={() => onOk()}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default ConfirmDialog;