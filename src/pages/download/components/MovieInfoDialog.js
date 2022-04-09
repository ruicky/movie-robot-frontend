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
import styled from "styled-components/macro";

const ListText = styled(ListItemText)`
    margin:0;
    word-break: break-all;
`;

function InfoList({data}) {
    return (
        <List dense>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item >
                        <Typography>种子名称：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText >{data?.name}</ListText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item >
                        <Typography>保存路径：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText>{data?.save_path}</ListText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item >
                        <Typography>内容路径：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText>{data?.content_path}</ListText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item >
                        <Typography>文件尺寸：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText>{data?.size_str}</ListText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item >
                        <Typography>已经上传：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText>{data?.uploaded_str}</ListText>
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
