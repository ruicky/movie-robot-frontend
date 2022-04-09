import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";

import {Info as InfoIcon} from '@mui/icons-material';
import {getTorrentInfo} from "@/utils/download_record";

function InfoList({data}) {
    return (
        <List dense>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography>种子名称：</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <ListItemText>{data?.name}</ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography>保存路径：</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <ListItemText>{data?.save_path}</ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography>内容路径：</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <ListItemText>{data?.content_path}</ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography>文件尺寸：</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <ListItemText>{data?.size_str}</ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Typography>已经上传：</Typography>
                    </Grid>
                    <Grid item xs={9}>
                        <ListItemText>{data?.uploaded_str}</ListItemText>
                    </Grid>
                </Grid>
            </ListItem>
        </List>
    );
}

export default function MovieInfoDialog({torrent_hash}) {
    const [open, setOpen] = React.useState(false);
    const [data, setDate] = React.useState({})
    const handleClickOpen = async () => {
        let result = await getTorrentInfo(torrent_hash)
        setDate(result.data)
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton onClick={handleClickOpen} aria-label="种子信息" size="small">
                <InfoIcon/>
            </IconButton>
            <Dialog
                open={open}
                onClose={handleClose}
                scroll='paper'
                aria-labelledby="scroll-dialog-title"
                aria-describedby="scroll-dialog-description"
                sx={{minWidth: '600'}}
            >
                <DialogTitle id="scroll-dialog-title">信息</DialogTitle>
                <DialogContent dividers sx={{padding: 0}}>
                    <InfoList data={data}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>关闭</Button>
                </DialogActions>
            </Dialog>
        </div>

    );
}
