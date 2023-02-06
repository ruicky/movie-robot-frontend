import DialogTitle from "@mui/material/DialogTitle";
import {
    Dialog,
    DialogContent,
    IconButton,
    Link,
    List,
    ListItem,
    ListItemText,
    ListSubheader,
    Tooltip,
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import {useEffect, useState} from "react";
import {useCustomSubRecordList, useDeleteCustomSubRecord, useRenewCustomSubRecord} from "@/utils/subscribe";
import message from "@/utils/message";
import ReplayIcon from '@mui/icons-material/Replay';
import DeleteIcon from '@mui/icons-material/Delete';

const ItemAction = ({id, status, reDownloadDisable = false, afterDelete = null, afterReDownload = null}) => {
    const {mutate: deleteItem} = useDeleteCustomSubRecord();
    const {mutate: renew} = useRenewCustomSubRecord();

    const onReDownload = () => {
        renew({id: id}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success("重新提交下载成功")
                    if (afterReDownload) {
                        afterReDownload();
                    }
                } else {
                    message.error(msg);
                }
            }
        })
    }

    const onDeleteItem = () => {
        deleteItem({id: id}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success("删除成功")
                    if (afterDelete) {
                        afterDelete();
                    }
                } else {
                    message.error(msg);
                }
            }
        })
    }

    if (status === 'SubmitDownloadFailed' && !reDownloadDisable) {
        return <Tooltip title="重新提交下载">
            <IconButton onClick={onReDownload}>
                <ReplayIcon/>
            </IconButton>
        </Tooltip>
    } else if (status === 'SubmitDownloadSucceeded' || reDownloadDisable) {
        return <Tooltip title="删除这条记录">
            <IconButton onClick={onDeleteItem}>
                <DeleteIcon/>
            </IconButton>
        </Tooltip>
    } else {
        return null;
    }
}
export const RecordDialog = ({title, subId, open, handleClose}) => {
    const {mutate: getList} = useCustomSubRecordList();
    const [list, setList] = useState(null);
    const fetchList = (subId) => {
        if (subId) {
            getList({sub_id: subId}, {
                onSuccess: res => {
                    const {code, message: msg, data} = res;
                    if (code === 0) {
                        setList(data);
                    } else {
                        message.error(msg);
                    }
                }
            });
        }
    }
    useEffect(() => {
        fetchList(subId);
    }, [subId]);
    return (
        <Dialog maxWidth={"md"} open={open} onClose={handleClose} fullWidth>
            <DialogTitle>
                {title}
                <IconButton
                    aria-label="close"
                    onClick={handleClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon/>
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <List
                    sx={{
                        width: '100%',
                        bgcolor: 'background.paper',
                        position: 'relative',
                        overflow: 'auto',
                        maxHeight: 500,
                        '& ul': {padding: 0},
                    }}
                    subheader={<li/>}
                >
                    {list && list.length > 0 ? list.map((item) => (
                        <li key={`section-${item.status}`}>
                            <ul>
                                <ListSubheader>
                                    {item.status === 'Pending' && "处理中(" + item.items.length + ")"}
                                    {item.status === 'SubmitDownloadFailed' && "提交下载失败(" + item.items.length + ")"}
                                    {item.status === 'SubmitDownloadSucceeded' && "提交下载成功(" + item.items.length + ")"}
                                </ListSubheader>
                                {item.items && item.items.map((subItem) => (
                                    <ListItem key={subItem.id} secondaryAction={
                                        <ItemAction id={subItem.id} status={subItem.status}
                                                    reDownloadDisable={subItem.download_message === null||subItem.download_message===''}
                                                    afterDelete={() => fetchList(subId)}
                                                    afterReDownload={() => fetchList(subId)}/>
                                    }>
                                        <ListItemText
                                            primary={<Link color="inherit" target={"_blank"}
                                                           href={subItem.torrent_detail_url}>{subItem.torrent_subject}</Link>}
                                            secondary={<React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {subItem.torrent_name}
                                                </Typography>
                                                {` — ${subItem.size} 来自${subItem.site_name}`}
                                            </React.Fragment>}/>
                                    </ListItem>
                                ))}
                            </ul>
                        </li>
                    )) : <ListItemText primary={"还没有相关的下载记录"}/>}
                </List>
            </DialogContent>
        </Dialog>
    )
}