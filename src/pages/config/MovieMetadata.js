import React from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {Paper, Typography} from "@mui/material";

import MediaServerConfigComponent from "../../components/config/MediaServerConfigComponent";
import MovieMetadataConfigComponent from "@/components/config/MovieMetadataConfigComponent";
import {useLocation} from "react-router-dom";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function MovieMetadata() {
    const location = useLocation();
    let isInit = false;
    if (location.pathname.startsWith('/setup')) {
        isInit = true
    }
    return (<React.Fragment>
        <Wrapper>
            <Helmet title="媒体服务器设置 - 初始化"/>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
                媒体元数据接口设置
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                此页面接口均需要稳定的网络环境，精美的图片显示，精准的影视信息识别准确率全部依靠这些接口。
            </Typography>

            <MovieMetadataConfigComponent isInit={isInit}/>
        </Wrapper>
    </React.Fragment>);
}

export default MovieMetadata;
