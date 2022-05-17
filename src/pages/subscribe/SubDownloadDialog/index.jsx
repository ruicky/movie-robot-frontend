import React, {useState} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,} from '@mui/material';
import {useRunSubDownload} from "@/utils/subscribe";
import {Download as DownloadIcon} from "@mui/icons-material";
import {SmallButton} from "@/components/core/SmallButton";
import message from "@/utils/message";


const SubDownloadDialog = ({}) => {
    const [open, setOpen] = useState(false)
    const {mutate: runSubDownload, isLoading} = useRunSubDownload();
    const handleSubmit = () => {
        runSubDownload({}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                }else{
                    message.error(msg);
                }
                setOpen(false)
            },
            onError: error => message.error(error)
        });
    }
    return (
        <>
            <SmallButton size="small" mr={2}>
                <DownloadIcon onClick={() => setOpen(true)}/>
            </SmallButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {'操作提示'}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        确定要立即下载一遍订阅中的任务吗？这个操作会立即去站点搜索并下载，如果操作频率过高，可能导致站点限流。
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                        确定
                    </Button>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                </DialogActions>
            </Dialog>
        </>

    );
};

export default SubDownloadDialog;