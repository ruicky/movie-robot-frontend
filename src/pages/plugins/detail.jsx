import {Helmet} from "react-helmet-async";
import {Divider as MuiDivider, Grid, Typography, Paper, ButtonBase, Button} from "@mui/material";
import React from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import Changelog from "@/pages/plugins/components/Changelog";

const Img = styled('img')({
    maxWidth: '100%',
    maxHeight: 235,
    borderRadius:'8px'
});
const Divider = styled(MuiDivider)(spacing);

const PluginsDetail = () => {
    return (
        <>
            <Helmet title="插件"/>
            <Typography variant="h3" gutterBottom>
                插件
            </Typography>
            <Divider my={4}/>
            <Paper
                sx={{
                    p: 2,
                    margin: 'auto',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item>
                        <Img src="http://p.xmoviebot.com/plugins/discordlogo.jpg" />
                    </Grid>
                    <Grid sx={{m:2}} item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h5" component="div">
                                Discord通知插件
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                由 yee 开发
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                系统产生一些关键事件时，发送通知到Discord。系统产生一些关键事件时，发送通知到Discord。系统产生一些关键事件时，发送通知到Discord。
                            </Typography>
                        </Grid>
                        <Grid item>
                            <Button>
                                安装
                            </Button>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Divider my={4}/>
            <Changelog/>
        </>
    );
}
export default PluginsDetail;