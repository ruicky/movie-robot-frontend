import React from "react";
import FilterList from "@/pages/selectors/Filter/List";
import RuleList from "@/pages/selectors/Rule/List";
import {Breadcrumbs, Divider as MuiDivider, Grid, Link, Typography} from "@mui/material";
import {Helmet} from "react-helmet-async";
import {NavLink} from "react-router-dom";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";

const Divider = styled(MuiDivider)(spacing);

function SelectorsIndex() {
    return (
        <React.Fragment>
            <Helmet title="过滤器与排序规则"/>
            <Typography variant="h3" gutterBottom display="inline">
                过滤器与排序规则
            </Typography>

            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                <Link component={NavLink} to="/setting/index">
                    设置
                </Link>
                <Typography>过滤器与排序规则</Typography>
            </Breadcrumbs>
            <Divider my={6}/>
            <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                    <FilterList/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <RuleList/>
                </Grid>
            </Grid>
        </React.Fragment>
    )
}

export default SelectorsIndex;