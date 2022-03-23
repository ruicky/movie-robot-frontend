import React, {useState} from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {FormControl, FormHelperText, MenuItem, Paper, Select, Typography} from "@mui/material";

import {useLocation} from "react-router-dom";
import BarkConfigComponent from "@/pages/config/notify/BarkConfigComponent";
import QywxConfigComponent from "@/pages/config/notify/QywxConfigComponent";
import PushDeerConfigComponent from "@/pages/config/notify/PushDeerConfigComponent";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function NotifyConfig() {
    const [app, setApp] = useState("qywx")
    const location = useLocation();
    let isInit = false;
    if (location.pathname.startsWith('/setup')) {
        isInit = true
    }
    return (<React.Fragment>
        <Wrapper>
            <Helmet title={isInit ? "下载工具设置 - 初始化" : "下载工具设置"}/>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
                通知应用设置
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                设置好通知功能，可以再电影下载、整理、刮削完推送消息到手机。
            </Typography>
            <FormControl m={4} fullWidth>
                <Select
                    name="type"
                    value={app}
                    onChange={(e) => {
                        setApp(e.target.value)
                    }}
                    displayEmpty
                >
                    <MenuItem value="qywx">企业微信</MenuItem>
                    <MenuItem value="bark">Bark</MenuItem>
                    <MenuItem value="pushdeer">PushDeer</MenuItem>
                </Select>
                <FormHelperText>目前已支持的推送应用</FormHelperText>
            </FormControl>
            {app === 'qywx' && <QywxConfigComponent isInit={isInit}/>}
            {app === 'bark' && <BarkConfigComponent isInit={isInit}/>}
            {app === 'pushdeer' && <PushDeerConfigComponent isInit={isInit}/>}
        </Wrapper>
    </React.Fragment>);
}

export default NotifyConfig;
