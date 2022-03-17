import React from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {
    Grid,
    Divider as MuiDivider,
    Typography as MuiTypography,
} from "@mui/material";
import {spacing} from "@mui/system";
import {green, red} from "@mui/material/colors";

import Stats from "./Stats";
import Table from "./Table";

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function SiteDashboard() {

    return (
        <React.Fragment>
            <Helmet title="SaaS Dashboard"/>
            <Grid justifyContent="space-between" container spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom>
                        我的站点
                    </Typography>
                    <Typography variant="subtitle1">
                        共有5个站点，其中有3个是尊贵的VIP身份！👍
                    </Typography>
                </Grid>
            </Grid>

            <Divider my={6}/>

            <Grid container spacing={6}>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="今日上传"
                        amount="235.14 GB"
                        chip="18:00"
                        percentagetext="+54.12%"
                        desc='比昨日变化'
                        percentagecolor={green[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="今日下载"
                        amount="15.55 GB"
                        chip="18:00"
                        percentagetext="-26.12%"
                        desc='比昨日变化'
                        percentagecolor={red[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="总上传量"
                        amount="51.5 TB"
                        chip="18:00"
                        percentagetext="2.67 TB"
                        desc='近7日新增'
                        percentagecolor={green[500]}
                    />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3} xl>
                    <Stats
                        title="总下载量"
                        amount="15.22TB"
                        chip="18:00"
                        percentagetext="654.23 GB"
                        desc='近7日下载'
                        percentagecolor={green[500]}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={6}>
                <Grid item xs={12} lg={12}>
                    <Table/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default SiteDashboard;
