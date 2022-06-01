import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";
import React, {useState} from "react";
import {useSubmitDownloadSubtitle} from "@/api/TaskApi";
import message from "@/utils/message";

function DownloadSubtitleDialog({media_name, tmdb_id, media_type, season_index = null, episode_index = null}) {
    const [open, setOpen] = useState(false);
    const {mutate: submitTask, isLoading} = useSubmitDownloadSubtitle();
    const handleSubmit = () => {
        submitTask({
            tmdb_id,
            media_type,
            season_index,
            episode_index: episode_index ? episode_index.join(',') : null
        }, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(msg);
                } else {
                    message.error(msg);
                }
                setOpen(false)
            },
            onError: error => message.error(error)
        })
    }
    return (
        <>
            <Button variant="outlined" startIcon={<ClosedCaptionIcon/>} onClick={() => setOpen(true)}>
                下载字幕
            </Button>
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
                        {media_type === "Movie" && `确定要发起${media_name}的字幕下载任务么？`}
                        {media_type === "TV" && `确定要发起${media_name} 第${season_index}季 ${episode_index}集 的字幕下载任务么？`}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>取消</Button>
                    <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DownloadSubtitleDialog;