import React from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {Breadcrumbs, Divider as MuiDivider, Link, Paper, Typography} from "@mui/material";

import MediaServerConfigComponent from "./components/MediaServerConfigComponent";
import MovieMetadataConfigComponent from "@/pages/config/components/MovieMetadataConfigComponent";
import {NavLink, useLocation} from "react-router-dom";
import DoubanConfigComponent from "@/pages/config/douban/DoubanConfigComponent";
import {spacing} from "@mui/system";


const Divider = styled(MuiDivider)(spacing);


function DoubanConfig() {
    const location = useLocation();
    let isInit = false;
    if (location.pathname.startsWith('/setup')) {
        isInit = true
    }
    return (<React.Fragment>
            <Helmet title="豆瓣智能下载设置"/>
            <Typography variant="h3" gutterBottom display="inline">
                豆瓣想看与智能下载保存规则
            </Typography>

            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                <Link component={NavLink} to="/setting/index">
                    设置
                </Link>
                <Typography>豆瓣想看与智能下载保存规则</Typography>
            </Breadcrumbs>
            <Divider my={6}/>
            <DoubanConfigComponent/>
    </React.Fragment>);
}

export default DoubanConfig;
