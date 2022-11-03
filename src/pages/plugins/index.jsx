import {Helmet} from "react-helmet-async";
import {Divider as MuiDivider, Grid, Typography} from "@mui/material";
import React from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {PluginItem} from "@/pages/plugins/components/PluginItem";
const Divider = styled(MuiDivider)(spacing);

const PluginsIndex = () => {
    return (<>
        <Helmet title="插件"/>
        <Typography variant="h3" gutterBottom>
            插件
        </Typography>
        <Divider my={4}/>
        <Grid spacing={4} container>
            <Grid xs={12} md={6} item>
                <PluginItem
                    name={"Discord通知插件"}
                    desc={"系统产生一些关键事件时，发送通知到Discord。"}
                    authorNickname={"yee"}
                    imageUrl={"http://p.xmoviebot.com/plugins/discordlogo.jpg"}
                    version={"v0.1"}
                />
            </Grid>
            <Grid xs={12} md={6} item>
                <PluginItem
                    name={"Telegram交互机器人"}
                    desc={"可以通过tg机器人操控本产品核心功能"}
                    authorNickname={"yee"}
                    imageUrl={"http://p.xmoviebot.com/plugins/tg_bot_logo.jpg"}
                    version={"v1.0"}
                    installed={true}
                />
            </Grid>
        </Grid>
    </>)
}
export default PluginsIndex;