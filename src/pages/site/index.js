import React, {useEffect, useState} from "react";
import {Helmet} from "react-helmet-async";
import {Grid, Snackbar,} from "@mui/material";

import Table from "./Table";
import Overview from "./Overview";
import axios from "../../utils/request";
import SetSite from "./SetSite";
import DeleteSite from "./DeleteSite";
import {getSiteSharesData} from "@/api/SiteApi";
import SiteSharesWeek from "@/pages/site/SiteSharesWeek";
import {Skeleton} from "@mui/lab";
import SiteSharesDay from "@/pages/site/SiteSharesDay";


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
    const [message, setMessage] = useState(false)
    const [tableData, setTableData] = useState([])
    const [edit, setEdit] = useState({open: false, opType: 'add'})
    const [deleteSite, setDeleteSite] = useState()
    const [siteMeta, setSiteMeta] = useState()
    const [sharesWeekData, setSharesWeekData] = useState()
    const [sharesTodayUploadData, setSharesTodayUploadData] = useState()
    const [sharesTodayDownloadData, setSharesTodayDownloadData] = useState()
    const editOnClose = () => {
        setEdit({...edit, open: false});
    }
    const onEditSuccess = (opType, values) => {
        refreshSites()
        if (opType === 'add') {
            setMessage(values.site_name + "添加成功！")
        } else {
            setMessage(values.site_name + "更新成功！")
        }
        setEdit({...edit, open: false});
    }
    const refreshSites = () => {
        axios.get("/api/site/get_sites").then((res) => {
            if (res.code === 0) {
                setTableData(res.data)
            }
        })
    }
    const refreshOverview = () => {
        axios.get("/api/site/overview").then((res) => {
            if (res.code === 0) {
                setOverview(res.data)
            }
        })
    }
    const fetchSharesWeekData = () => {
        getSiteSharesData().then(r => {
            setSharesWeekData(r.data?.week)
            setSharesTodayUploadData(r.data?.today_upload)
            setSharesTodayDownloadData(r.data?.today_download)
        })
    }
    const onDeleteSiteClick = (row) => {
        setDeleteSite(row)
    }
    const onDeleteSiteClose = () => {
        setDeleteSite(undefined)
    }
    const onDeleteSite = async (site) => {
        try {
            const res = await axios.post("/api/site/delete", {id: site.id});
            const {code, message, data} = res;
            if (code === undefined || code === 1) {
                setMessage(message);
                return;
            }
            refreshSites()
            setMessage(site.site_name + "已经删除！");
            setDeleteSite(undefined)
        } catch (error) {
            const message = error.message || "删除出错啦";
            setMessage(message);
        }
    }
    const onUpdateClick = async (setUpdating) => {
        setUpdating(true)
        try {
            const res = await axios.get("/api/site/update_sites", {timeout: 180000});
            const {code, message, data} = res;
            if (code === undefined || code === 1) {
                setMessage(message);
                return;
            }
            refreshOverview();
            refreshSites();
            fetchSharesWeekData();
            setMessage("所有站点数据更新完毕！");
        } catch (error) {
            const message = error.message || "站点数据更新出错！";
            setMessage(message);
        } finally {
            setUpdating(false)
        }
    }
    useEffect(async () => {
        let res = await axios.get('/api/common/sites')
        setSiteMeta(res.data)
        refreshOverview();
        refreshSites();
        fetchSharesWeekData();
    }, []);
    return (<React.Fragment>
        <Helmet title="站点管理"/>
        <Snackbar
            open={!!message}
            autoHideDuration={3000}
            onClose={() => {
                setMessage(undefined);
            }}
            message={message}
        />
        <Overview data={overview} onUpdateClick={onUpdateClick}/>
        <SetSite open={edit.open} opType={edit.opType} site={edit.site}
                 siteMeta={siteMeta}
                 filterSiteNames={tableData.map(x => x.site_name)}
                 onEditSuccess={onEditSuccess} onClose={editOnClose}/>
        <Grid container spacing={6}>
            <Grid item xs={12} lg={3}>
                <Grid container spacing={6}>
                    <Grid item xs={12}>
                        {sharesTodayUploadData ? <SiteSharesDay title="今日上传" data={sharesTodayUploadData}/> :
                            <Skeleton variant="rectangular"/>}
                    </Grid>
                    <Grid item xs={12}>
                        {sharesTodayDownloadData ? <SiteSharesDay title="今日下载" data={sharesTodayDownloadData}/> :
                            <Skeleton variant="rectangular"/>}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12} lg={9}>
                {sharesWeekData ? <SiteSharesWeek data={sharesWeekData}/> :
                    <Skeleton variant="rectangular"/>}
            </Grid>
            <Grid item xs={12} lg={12}>
                <DeleteSite deleteRecord={deleteSite} onClose={onDeleteSiteClose} onDelete={onDeleteSite}/>
                <Table data={tableData}
                       siteMeta={siteMeta}
                       onUpdateClick={(site) => setEdit({open: true, opType: 'update', site})}
                       onAddClick={() => setEdit({open: true, opType: "add", site: null})}
                       onDeleteClick={onDeleteSiteClick}
                />
            </Grid>
        </Grid>
    </React.Fragment>);
}

export default SiteDashboard;
