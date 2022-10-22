import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
} from '@mui/material';
import message from "@/utils/message";
import {useDeleteSubCustom} from "@/utils/subscribe";


const DeleteDialog = ({open, handleClose, onSuccess, id, name, showDeleteRemote = false}) => {
    const {mutate: deleteFilter, isLoading} = useDeleteSubCustom();
    const [deleteRemote, setDeleteRemote] = useState(false);
    const handleSubmit = async () => {
        deleteFilter({id, delete_remote: deleteRemote}, {
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
                    确定要删除 {name} 这个自定义订阅吗，删除后将无法恢复！
                </DialogContentText>
                {showDeleteRemote && <FormControlLabel
                    control={<Checkbox
                        name="all_pages"
                        checked={deleteRemote}
                        onChange={(e) => setDeleteRemote(e.target.checked)}
                    />}
                    label="这个订阅您曾经分享到服务器给其他用户，是否一并删除？"
                />}
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