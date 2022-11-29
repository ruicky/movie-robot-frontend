import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useGetLogFiles, useGetLogLines } from "@/api/CommonApi";
import { Helmet } from "react-helmet-async";
import {
    Box,
    Breadcrumbs,
    Divider as MuiDivider,
    FormControl,
    FormControlLabel,
    Link,
    MenuItem,
    Select,
    Stack,
    Switch,
    Typography
} from "@mui/material";
import styled from "styled-components/macro";
import { spacing } from "@mui/system";
import { NavLink } from "react-router-dom";
import { useInterval } from "@/hooks/useInterval";
import LogHighlight from "@/components/LogHighlight/LogHighlight";

const Divider = styled(MuiDivider)(spacing);

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
            LogHighlightRef.current.scrollToIndex(logs.length - 1)
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

    return (<Box display={"flex"} flexDirection={"column"} sx={{ width: '100%', height: '100%' }}>
        <Helmet title="应用运行日志" />
        <Typography variant="h3" gutterBottom>
            应用运行日志
        </Typography>
        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                应用设置
            </Link>
            <Typography>应用日志</Typography>
        </Breadcrumbs>
        <Divider mt={4} />
        <Stack my={2} direction={"row"} spacing={2}>
            <FormControl>
                <Select
                    size={"small"}
                    value={selectLogFile || ""}
                    onChange={(e) => setSelectLogFile(e.target.value)}
                >
                    {logFiles?.data && logFiles?.data.length > 0 && logFiles?.data.map((file, index) => (
                        <MenuItem key={index} value={file}>{file}</MenuItem>
                    ))}
                </Select>
            </FormControl>
            <div>
                <FormControlLabel
                    control={<Switch checked={isAutoScroll} onChange={(e) => setIsAutoScroll(e.target.checked)} />}
                    label="自动滚动" />
                <FormControlLabel
                    control={<Switch checked={isAutoRefresh} onChange={(e) => setIsAutoRefresh(e.target.checked)} />}
                    label="自动刷新" />
            </div>
        </Stack>
        <LogHighlight ref={LogHighlightRef} logs={logs} />
    </Box>);
}
export default AppLog;
