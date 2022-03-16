import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import DownloadClientConfigComponent from "../../../components/config/DownloadClientConfigComponent";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function InitDownloadClient() {
  return (<React.Fragment>
    <Wrapper>
      <Helmet title="下载工具设置 - 初始化" />

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        下载工具设置
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        关联下载工具，可以进行种子自动提交，监控下载进度等操作。
      </Typography>

      <DownloadClientConfigComponent isInit={true} />
    </Wrapper>
  </React.Fragment>);
}

export default InitDownloadClient;
