import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import MediaPathConfigComponent from "../../../components/config/MediaPathConfigComponent";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function InitMediaPath() {
  return (<React.Fragment>
    <Wrapper>
      <Helmet title="下载工具设置 - 初始化" />

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        媒体文件夹设置
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        设置你存放影视文件的路径后，系统可以帮你自动整理"刮削"
      </Typography>

      <MediaPathConfigComponent isInit={true} />
    </Wrapper>
  </React.Fragment>);
}

export default InitMediaPath;
