import React from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {Link, Paper, Typography} from "@mui/material";
import {useLocation} from "react-router-dom";
import FreeDownloadConfigComponent from "@/pages/config/components/FreeDownloadConfigComponent";


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
            <Helmet title={isInit ? "流量管理设置 - 初始化" : "流量管理设置"}/>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
                流量管理
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                开启此功能后，还需要在站点设置中，设置对应站点的养护方式。
                <Link target="_blank"
                      href="https://feather-purple-bdd.notion.site/854f2ab70f394358b00b0ff9e2c1690a">学习如何使用</Link>
            </Typography>

            <FreeDownloadConfigComponent isInit={isInit}/>
        </Wrapper>
    </React.Fragment>);
}

export default MovieMetadata;
