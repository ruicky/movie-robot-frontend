import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React from "react";

const DeleteSite = ({deleteRecord, onDelete, onClose}) => {
    return (<Dialog
        open={deleteRecord !== undefined}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
    >
        <DialogTitle id="alert-dialog-title">
            {"真的要删除吗?"}
        </DialogTitle>
        <DialogContent>
            <DialogContentText id="alert-dialog-description">
                删除后将无法及时更新站点分享数据，也无法使用搜索和智能下载！
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => onDelete(deleteRecord)} color="primary" autoFocus>
                确认
            </Button>
            <Button onClick={onClose} color="primary">
                取消
            </Button>
        </DialogActions>
    </Dialog>);
};
export default DeleteSite