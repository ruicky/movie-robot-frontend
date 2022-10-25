import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React from "react";
import {ShareRuleList} from "@/pages/subscribe/components/ShareRuleList";

export const ShareRuleListDialog = ({open, handleClose}) => {
    return (<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        sx={{maxHeight: 800}}
        size={'sm'}
        fullWidth
    >
        <DialogTitle id="alert-dialog-title">
            分享订阅规则给其他用户
        </DialogTitle>
        <DialogContent>
            <ShareRuleList/>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
        </DialogActions>
    </Dialog>);
}