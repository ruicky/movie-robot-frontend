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
    Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import {useEffect, useState} from "react";
import {useCustomSubRecordList} from "@/utils/subscribe";
import message from "@/utils/message";

export const RecordDialog = ({title, subId, open, handleClose}) => {
    const {mutate: getList} = useCustomSubRecordList();
    const [list, setList] = useState(null);
    const fetchList = (subId) => {
        getList({sub_id: subId}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    setList(data);
                } else {
                    message.error(msg);
                }
            }
        })
    }
    useEffect(() => {
        if (subId) {
            fetchList(subId);
        }
    }, [subId]);
    return (
        <Dialog maxWidth={"sm"} open={open} onClose={handleClose} fullWidth>
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
                                    <ListItem key={subItem.id}>
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