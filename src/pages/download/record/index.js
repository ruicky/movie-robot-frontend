import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import {Divider as BtnDivider, Divider as MuiDivider, Grid, Stack, Typography} from "@mui/material";
import MovieCard from "../components/MovieCard";
import {getDownloading, getRecordList} from "@/api/DownloadApi";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import ReAnalyze from "@/pages/download/components/ReAnalyze";
import DeleteConfirm from "@/pages/download/components/DeleteConfirm";
import {useInterval} from "@/utils/hooks";
import {Loop as LoopIcon} from "@mui/icons-material";
import {SmallButton} from "@/components/core/SmallButton";
import ChartDialogs from "@/pages/download/components/ChartDialogs";
import {STATUS} from "@/constants";
import {Alert} from "@mui/lab";

const Divider = styled(MuiDivider)(spacing);
export default function DownloadRecords() {
    const [list, setList] = useState([]);
    const [analyzeData, setAnalyzeData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [downloadingList, setDownloadingList] = useState([]);
    const [downloadQueueSize, setDownloadQueueSize] = useState(0);
    const fetchData = async () => {
        const result = await getRecordList();
        setDownloadQueueSize(result.download_queue_size);
        const list = [];
        if (!result.data?.result) {
            return;
        }
        // 数据处理
        for (let r of result.data.result) {
            let desc = r.download_status === 3 ? r.torrent_subject : r.desc;
            if (desc === undefined || desc === null) {
                desc = "暂无";
            }
            list.push({
                id: r.id,
                title: r.movie_name,
                tname: r.torrent_name,
                site_name: r.site_name,
                movie_type: r.movie_type,
                image: r.thumb_image_url,
                status: STATUS[r.download_status].msg,
                status_color: STATUS[r.download_status].color,
                status_code: r.download_status,
                desc: desc,
                year: r.movie_year,
                hash: r.torrent_hash,
                media_source: r.media_source,
                resolution: r.resolution,
                media_encoding: r.media_encoding,
                link_path: r.link_path,
                url: r.url,
                season_index: r.season_index,
                season_year: r.season_year
            });
        }
        setList(list);
    }

    const fetchDownloadingList = async () => {
        const downloadList = list?.filter(x => x.status_code === 0);
        if (downloadList.length > 0) {
            const result = await getDownloading();
            setDownloadQueueSize(result.data?.download_queue_size);
            setDownloadingList(result.data?.result);
        }
    }

    useInterval(fetchDownloadingList, 1500)

    const removeDataById = (id) => {
        const temp = list.filter(x => x.id !== id);
        setList(temp)
    }

    // 初始化加载数据
    useEffect(async () => {
        await fetchData()
        await fetchDownloadingList();
    }, [])
    const onUpdateClick = async () => {
        await fetchData()
        await fetchDownloadingList();
    }
    return (
        <React.Fragment>
            <Helmet title="下载记录"/>
            <Grid justifyContent="space-between" container spacing={6}>
                <Grid item>
                    <Typography variant="h3" gutterBottom>
                        近期下载
                    </Typography>
                </Grid>
                <Grid item>
                    <Stack direction="row" divider={<BtnDivider orientation="vertical" flexItem/>} spacing={1}>
                        <ChartDialogs/>
                        <SmallButton size="small" mr={2} onClick={() => onUpdateClick()}>
                            <LoopIcon/>
                        </SmallButton>
                    </Stack>
                </Grid>
            </Grid>
            <Divider my={4}/>
            {downloadQueueSize && downloadQueueSize > 0 ? <Stack sx={{width: '100%', mb: 4}} spacing={2}>
                <Alert variant="filled" severity="warning">有{downloadQueueSize}个下载请求等待提交，不必过快下载，也不要重启程序！</Alert>
            </Stack> : null}
            <Grid container={true} spacing={6}>
                {
                    list.map(movie => {
                        const downloading = downloadingList?.find(down => down.hash === movie.hash)
                        return <MovieCard key={movie.id} data={movie} onDelete={setDeleteData} downloading={downloading}
                                          onAnalyze={setAnalyzeData}/>
                    })
                }
            </Grid>
            {/*重新识别*/}
            <ReAnalyze {...analyzeData} onAnalyze={setAnalyzeData} onAnalyzeSuccess={async () => {
                await fetchData();
                await fetchDownloadingList();
            }}/>
            {/*删除*/}
            <DeleteConfirm {...deleteData} onDelete={setDeleteData} removeDataById={removeDataById}/>
        </React.Fragment>
    );
};


