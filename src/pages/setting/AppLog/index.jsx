import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useGetLogFiles, useGetLogLines } from "@/api/CommonApi";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Grid,
    FormControl,
    FormControlLabel,
    MenuItem,
    Select,
    Stack,
    Switch,
    Typography, Divider as MuiDivider
} from "@mui/material";
import styled from "styled-components/macro";
import { useInterval } from "@/hooks/useInterval";
import LogHighlight from "@/components/LogHighlight/LogHighlight";
import { spacing } from "@mui/system";


const AppLog = () => {
    const LogHighlightRef = useRef(null);
    const [logs, setLogs] = useState([]);
    const [selectLogFile, setSelectLogFile] = useState(null);
    const { data: logFiles } = useGetLogFiles();
    const { mutate: getLogLines, isLoading } = useGetLogLines();
    const [isAutoScroll, setIsAutoScroll] = useState(true)
    const [isAutoRefresh, setIsAutoRefresh] = useState(false)
    const fetchLog = useCallback(() => {
        getLogLines({ log_file: selectLogFile }, {
            onSuccess: resData => {
                const { code, data } = resData;
                if (code === 0 && data) {
                    setLogs(data);
                }
            }
        });
    }, [getLogLines, selectLogFile])

    useInterval(() => {
        if (isAutoRefresh && !isLoading) {
            fetchLog();
        }
    }, 2000)

    useEffect(() => {
        if (isAutoScroll && LogHighlightRef.current) {
            LogHighlightRef.current.scrollToIndex(logs.length, {
                smoothScroll: false,
            })
            // 猜测是因为虚拟滚动高度计算未完成 导致滚动不到底部
            // 无法识别到计算完成的事件 暴力解决 1s 后再滚动一次
            setTimeout(() => {
                LogHighlightRef.current.scrollToIndex(logs.length - 1)
            }, 1000)
        }
    }, [isAutoScroll, logs.length])

    useEffect(() => {
        if (selectLogFile) {
            fetchLog();
        }
    }, [fetchLog, selectLogFile]);
    useEffect(() => {
        if (logFiles?.data && logFiles?.data.length > 0) {
            setSelectLogFile(logFiles.data[0]);
        }
    }, [logFiles])

    const Divider = styled(MuiDivider)(spacing);
    return (<Box display={"flex"} flexDirection={"column"} sx={{ width: '100%', height: '100%' }}>
        <Helmet title="应用运行日志" />
        <Grid container direction={{ xs: "column", sm: 'row', md: 'row' }} justifyContent="space-between" mb={{ xs: 0 }} >
            <Typography variant="h3" gutterBottom>
                应用运行日志
            </Typography>
            <Stack my={2} direction={'row'} spacing={{ xs: 0, sm: 2, md: 4 }}>
                <FormControl xs="auto">
                    <Select
                        size="small"
                        value={selectLogFile || ""}
                        onChange={(e) => setSelectLogFile(e.target.value)}
                    >
                        {logFiles?.data && logFiles?.data.length > 0 && logFiles?.data.map((file, index) => (
                            <MenuItem key={index} value={file}>{file}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <FormControlLabel control={<Switch size="small" checked={isAutoScroll} onChange={(e) => setIsAutoScroll(e.target.checked)} />} label="自动滚动" />
                <FormControlLabel control={<Switch size="small" checked={isAutoRefresh} onChange={(e) => setIsAutoRefresh(e.target.checked)} />} label="自动刷新" />
            </Stack>
        </Grid>
        <Divider mb={2} />
        <LogHighlight
            highlightLevelLine
            showFullScreenButton
            style={{ borderRadius: '5px' }}
            ref={LogHighlightRef}
            logs={logs}
        />
    </Box >);
}
export default AppLog;
