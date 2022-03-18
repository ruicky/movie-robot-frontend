import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";
import {
    Grid,
} from "@mui/material";

import Table from "./Table";
import Overview from "./Overview";
import axios from "../../utils/request";


function SiteDashboard() {
    const [overview, setOverview] = useState({
        "today_up": 0,
        "today_dl": 0,
        "yestday_up": 0,
        "yestday_dl": 0,
        "total_up": 0,
        "total_dl": 0,
        "dl_change_7": 0,
        "up_change_7": 0,
        "data_update_time": "-",
        "site_count": 0,
        "site_vip_count": 0,
        "today_up_rate": "-",
        "today_dl_rate": "-"
    })
    const [tableData, setTableData] = useState([])
    useEffect(() => {
        axios.get("/api/site/overview").then((res) => {
            if (!res.error && res.data.code == 0) {
                setOverview(res.data.data)
            }
        })
        axios.get("/api/site/get_sites").then((res) => {
            if (!res.error && res.data.code == 0) {
                setTableData(res.data.data)
            }
        })
    }, []);
    return (
        <React.Fragment>
            <Helmet title="站点管理"/>
            <Overview data={overview}/>
            <Grid container spacing={6}>
                <Grid item xs={12} lg={12}>
                    <Table data={tableData}/>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export default SiteDashboard;
