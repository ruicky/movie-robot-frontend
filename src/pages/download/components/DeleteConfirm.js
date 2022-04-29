import React, {useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid
} from "@mui/material";
import {deleteRecord} from "@/api/DownloadApi";
import message from "@/utils/message";

export default function DeleteConfirm(props) {
    const {id, open = false, onDelete, removeDataById} = props;
    const [deleteTorrent, setDeleteTorrent] = useState(true)
    const [addBlacklist, setAddBlacklist] = useState(false)
    const [deleteSub, setDeleteSub] = useState(false)
    const [deleteMediaServer, setDeleteMediaServer] = useState(true)
    useEffect(() => {
        setDeleteTorrent(true);
        setAddBlacklist(false);
        setDeleteSub(false);
    }, [id])
    const handleOk = async () => {
        const result = await deleteRecord({
            id,
            delete_torrent: deleteTorrent,
            add_blacklist: addBlacklist,
            delete_sub: deleteSub,
            delete_media_server: deleteMediaServer
        })
        if (result.code === 0) {
            message.success(result.message || '操作成功')
            removeDataById(id)
        } else {
            message.error(result.message || '操作失败')
        }
        onDelete({open: false})
    };

    const handleClose = () => {
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
                删除操作可以删掉本条下载记录，同时还可以勾选下列选项作出更多操作。
            </DialogContentText>
            <Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox
                            checked={deleteTorrent}
                            name="deleteTorrent"
                            onChange={(e) => setDeleteTorrent(e.target.checked)}
                        />}
                        label="删除下载器任务及文件(如果种子还在)"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox
                            checked={deleteMediaServer}
                            name="deleteMediaServer"
                            onChange={(e) => setDeleteMediaServer(e.target.checked)}
                        />}
                        label="删除媒体服务器对应资源（包括源文件）"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox
                            checked={deleteSub}
                            name="deleteSub"
                            onChange={(e) => setDeleteSub(e.target.checked)}
                        />}
                        label="删除关联订阅记录"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox
                            checked={addBlacklist}
                            name="addBlacklist"
                            onChange={(e) => setAddBlacklist(e.target.checked)}
                        />}
                        label="加入种子黑名单"
                    />
                </Grid>
            </Grid>
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
