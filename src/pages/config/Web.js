import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import WebConfigComponent from "./components/WebConfigComponent";
import {useLocation} from "react-router-dom";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Web() {
  const location = useLocation();
  let isInit = false;
  if (location.pathname.startsWith('/setup')) {
    isInit = true
  }
  return (<React.Fragment>
    <Wrapper>
      <Helmet title={isInit ? "网站访问设置 - 初始化" : "网站访问设置"}/>

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        网站访问设置
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        请记住此页面的配置，便于今后的访问
      </Typography>

      <WebConfigComponent isInit={isInit} />
    </Wrapper>
  </React.Fragment>);
}

export default Web;
