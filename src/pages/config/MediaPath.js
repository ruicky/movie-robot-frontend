import React from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {Breadcrumbs, Divider as MuiDivider, Link, Typography} from "@mui/material";

import MediaPathConfigComponent from "./components/MediaPathConfigComponent";
import {NavLink, useLocation} from "react-router-dom";
import {spacing} from "@mui/system";


const Divider = styled(MuiDivider)(spacing);


function MediaPath() {
    const location = useLocation();
    let isInit = false;
    if (location.pathname.startsWith('/setup')) {
        isInit = true
    }
    return (<React.Fragment>
        <Helmet title="设置媒体文件夹"/>
        <Typography variant="h3" gutterBottom display="inline">
            设置媒体文件夹
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>媒体文件夹</Typography>
        </Breadcrumbs>
        <Divider my={6}/>

        <MediaPathConfigComponent isInit={isInit}/>
    </React.Fragment>);
}

export default MediaPath;
