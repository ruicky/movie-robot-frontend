import React from 'react';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Grid,
    IconButton, Link,
    List,
    ListItem,
    ListItemText,
    Typography
} from "@mui/material";
import styled from "styled-components/macro";
import {Info as InfoIcon} from '@mui/icons-material';
import {getRecord} from "@/api/DownloadApi";

const ListText = styled(ListItemText)`
    margin:0;
    word-break: break-all;
`;

function getTorrentName(data) {
    if (data.record?.torrent_url) {
        return (
            <ListText>
                <Link href={data?.record.torrent_url} target="_blank">{data?.record.torrent_name}</Link>
            </ListText>
        )
    } else {
        return (<ListText>{data?.record.torrent_name}</ListText>)
    }
}

function InfoList({data}) {
    return (
        <List dense>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography>内容类型：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText>{data?.record.movie_type === "Movie" ? "电影" : "剧集"}</ListText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography>来自用户：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText>{data?.user_nickname}</ListText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography>来自站点：</Typography>
                    </Grid>
                    <Grid item xs>
                        <ListText>{data?.record.site_name === "unknown" ? "未知" : data?.record.site_name}</ListText>
                    </Grid>
                </Grid>
            </ListItem>
            <ListItem>
                <Grid container spacing={2}>
                    <Grid item>
                        <Typography>种子名称：</Typography>
                    </Grid>
                    <Grid item xs>
                        {getTorrentName(data)}
                    </Grid>
                </Grid>
            </ListItem>
            {data.torrent_info && (<React.Fragment>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography>保存路径：</Typography>
                            </Grid>
                            <Grid item xs>
                                <ListText>{data?.torrent_info.save_path}</ListText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography>内容路径：</Typography>
                            </Grid>
                            <Grid item xs>
                                <ListText>{data?.torrent_info.content_path}</ListText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography>链接路径：</Typography>
                            </Grid>
                            <Grid item xs>
                                <ListText>{data?.record.link_path}</ListText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography>文件尺寸：</Typography>
                            </Grid>
                            <Grid item xs>
                                <ListText>{data?.torrent_info.size_str}</ListText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography>已经上传：</Typography>
                            </Grid>
                            <Grid item xs>
                                <ListText>{data?.torrent_info.uploaded_str}</ListText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography>分享比率：</Typography>
                            </Grid>
                            <Grid item xs>
                                <ListText>{(data?.torrent_info.ratio * 100).toFixed(2)}%</ListText>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item>
                                <Typography>做种时间：</Typography>
                            </Grid>
                            <Grid item xs>
                                <ListText>{data?.torrent_info.seeding_time_str}</ListText>
                            </Grid>
                        </Grid>
                    </ListItem>
                </React.Fragment>
            )
            }
        </List>
    );
}

export default function MovieInfoDialog({id}) {
    const [open, setOpen] = React.useState(false);
    const [data, setDate] = React.useState({})
    const handleClickOpen = async () => {
        let result = await getRecord(id)
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
                <DialogTitle id="scroll-dialog-title">详细信息</DialogTitle>
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
