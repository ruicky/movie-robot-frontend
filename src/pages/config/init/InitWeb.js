import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import WebConfigComponent from "../../../components/config/WebConfigComponent";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function InitWeb() {
  return (<React.Fragment>
    <Wrapper>
      <Helmet title="Web配置 - 初始化" />

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        网站访问设置
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        请记住此页面的配置，便于今后的访问
      </Typography>

      <WebConfigComponent isInit={true} />
    </Wrapper>
  </React.Fragment>);
}

export default InitWeb;
