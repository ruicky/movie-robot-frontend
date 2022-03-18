import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import {deleteRecord} from "@/utils/download_record";
import message from "@/utils/message";

export default function DeleteConfirm(props) {
  const {id, open=false, onDelete, removeDataById} = props;

  const handleOk = async() => {
    await deleteRecord(id)
    message.success('操作成功')
    removeDataById(id)
    onDelete({open: false})
  };

  const handleClose = ()=>{
    onDelete({open: false})
  }

  return (<Dialog
    open={open}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"真的要删除吗?"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        删除下载记录后，有一定可能性会导致智能下载时，下到重复的电影。这个删除操作，会同时删除下载任务和对应文件！
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleOk} color="primary" autoFocus>
        确认
      </Button>
      <Button onClick={handleClose} color="primary">
        取消
      </Button>
    </DialogActions>
  </Dialog>);
}
