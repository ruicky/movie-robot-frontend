import React from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { useAddSubscribe } from '@/utils/subscribe';
import message from "@/utils/message";


const SubscribeDialog = ({open, handleClose, data, onComplete}) => {
  const { id, name } = data;
  const { mutateAsync:addSubscribe, isLoading } = useAddSubscribe();

  const handleSubmit = async () => {
    addSubscribe({id},{
      onSuccess: resData => {
        const { code, message:msg} = resData;
        if (code === 0) {
          message.success(`${name}已订阅`);
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
          提交订阅
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {`确定为 ${name}（ID:${id}） 添加订阅吗？`}
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
}

export default SubscribeDialog;
