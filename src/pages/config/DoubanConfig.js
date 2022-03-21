import React from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {Paper, Typography} from "@mui/material";

import MediaServerConfigComponent from "./components/MediaServerConfigComponent";
import MovieMetadataConfigComponent from "@/pages/config/components/MovieMetadataConfigComponent";
import {useLocation} from "react-router-dom";
import DoubanConfigComponent from "@/pages/config/douban/DoubanConfigComponent";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function DoubanConfig() {
    const location = useLocation();
    let isInit = false;
    if (location.pathname.startsWith('/setup')) {
        isInit = true
    }
    return (<React.Fragment>
        <Wrapper>
            <Helmet title="豆瓣智能下载设置"/>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
                豆瓣智能下载设置
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                监听豆瓣多人的账户，定时拉取并智能选择最适合你的种子进行下载。
            </Typography>

            <DoubanConfigComponent isInit={isInit}/>
        </Wrapper>
    </React.Fragment>);
}

export default DoubanConfig;
