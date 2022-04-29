import React from "react";
import FilterList from "@/pages/selectors/Filter/List";
import RuleList from "@/pages/selectors/Rule/List";
import {Divider, Grid, Typography} from "@mui/material";
import {Helmet} from "react-helmet-async";
import PageTitle from "@/components/PageTitle";

function SelectorsIndex() {
    return (
        <React.Fragment>
            <Helmet title="过滤器与排序规则"/>
            <PageTitle text="过滤器与排序规则"/>
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