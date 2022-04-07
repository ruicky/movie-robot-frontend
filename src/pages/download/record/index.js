import React, {useEffect, useState} from 'react';
import {Helmet} from "react-helmet-async";
import {Divider as MuiDivider, Grid, Typography} from "@mui/material";
import MovieCard from "../components/MovieCard";
import {getDownloading, getRecordList} from "@/utils/download_record";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import ReAnalyze from "@/pages/download/components/ReAnalyze";
import DeleteConfirm from "@/pages/download/components/DeleteConfirm";
import {useInterval} from "@/utils/hooks";


export default function DownloadRecords() {
    const [list, setList] = useState([]);
    const [analyzeData, setAnalyzeData] = useState({});
    const [deleteData, setDeleteData] = useState({});
    const [downloadingList, setDownloadingList] = useState([]);

    const fetchData = async () => {
        const result = await getRecordList();
        setList(result);

    }

    const fetchDownloadingList = async () => {
        const downloadList = list?.filter(x => x.status_code === 0);
        if (downloadList.length > 0) {
            const result = await getDownloading();
            setDownloadingList(result.data);
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

    return (
        <React.Fragment>
            <Helmet title="下载记录"/>
            <Typography variant="h3" gutterBottom display="inline">
                近期下载
            </Typography>
            <Divider my={4}/>
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

const Divider = styled(MuiDivider)(spacing);
