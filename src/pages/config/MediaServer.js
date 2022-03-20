import React from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {Paper, Typography} from "@mui/material";

import MediaServerConfigComponent from "./components/MediaServerConfigComponent";
import {useLocation} from "react-router-dom";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function MediaServer() {
    const location = useLocation();
    let isInit = false;
    if (location.pathname.startsWith('/setup')) {
        isInit = true
    }
    return (<React.Fragment>
        <Wrapper>
            <Helmet title={isInit ? "媒体服务设置 - 初始化" : "媒体服务设置"}/>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
                媒体服务设置
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                配置媒体服务，可以帮您跳过已经存在的影视，避免重复下载
            </Typography>

            <MediaServerConfigComponent isInit={isInit}/>
        </Wrapper>
    </React.Fragment>);
}

export default MediaServer;
