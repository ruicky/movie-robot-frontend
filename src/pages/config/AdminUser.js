import React from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";

import { Paper, Typography } from "@mui/material";

import WebConfigComponent from "./components/WebConfigComponent";
import {useLocation} from "react-router-dom";
import AdminUserConfigForm from "@/pages/config/components/AdminUserConfigForm";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function Web() {
  return (<React.Fragment>
    <Wrapper>
      <Helmet title="管理用户 - 初始化"/>

      <Typography component="h1" variant="h4" align="center" gutterBottom>
        管理用户设置
      </Typography>
      <Typography component="h2" variant="body1" align="center">
        初始化完成后还可以用户管理页面修改
      </Typography>

      <AdminUserConfigForm />
    </Wrapper>
  </React.Fragment>);
}

export default Web;
