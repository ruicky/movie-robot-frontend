import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useDeleteSubscribe } from '@/utils/subscribe';
import message from "@/utils/message";


const DeleteConfrimDialog = ({open, handleClose, data}) => {
  const { id, name } = data;
  const { mutate: deleteSubscribe, isLoading } = useDeleteSubscribe();

  const handleSubmit = async () => {
    deleteSubscribe({id},{
      onSuccess: resData => {
        const { code, message:msg} = resData;
        if (code === 0) {
          message.success(`${name}已删除`);
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
        {`确定删除 ${name} 的订阅吗？`}
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

export default DeleteConfrimDialog;