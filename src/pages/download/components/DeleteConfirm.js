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
import {deleteRecord} from "@/utils/download_record";
import message from "@/utils/message";

export default function DeleteConfirm(props) {
    const {id, open = false, onDelete, removeDataById} = props;
    const [deleteTorrent, setDeleteTorrent] = useState(true)
    const [addBlacklist, setAddBlacklist] = useState(false)
    const [deleteSub, setDeleteSub] = useState(false)
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
            delete_sub: deleteSub
        })
        message.success(result.message || '操作成功')
        removeDataById(id)
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
                            checked={deleteSub}
                            name="deleteSub"
                            onChange={(e) => setDeleteSub(e.target.checked)}
                        />}
                        label="删除关联订阅记录(将不再参与智能下载,可以重新订阅)"
                    />
                </Grid>
                <Grid item>
                    <FormControlLabel
                        control={<Checkbox
                            checked={addBlacklist}
                            name="addBlacklist"
                            onChange={(e) => setAddBlacklist(e.target.checked)}
                        />}
                        label="加入黑名单(智能下载将会跳过这个种子)"
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
