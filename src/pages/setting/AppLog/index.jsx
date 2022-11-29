import React, { useEffect, useRef, useState, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual';
import Prism from "prismjs";
import 'prismjs/components/prism-log.min.js'
import 'prismjs/themes/prism-twilight.min.css';
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

const Divider = styled(MuiDivider)(spacing);

const LogContainer = styled.div`
    /* 滚动槽 */
    &::-webkit-scrollbar {
        width: 8px;
        height: 8px;
    }
    &::-webkit-scrollbar-track {
        border-radius: 3px;
        background: rgba(158, 158, 158, 0.185);
        box-shadow: inset 0 0 2px #000000;
    }
    /* 滚动条滑块 */
    &::-webkit-scrollbar-thumb {
        border-radius: 5px;
        background: #00000096;
    }
    height: 400px;
    width: 100%;
    overflow-x: auto;
    flex: 1 0 auto;
    line-height: 1;
    background: rgb(23,23,23);
    border-radius: 5px;
    padding: 10px;

    // 移动端
    @media (max-width: 600px) {
        padding: 0px;
        code {
            font-size: 10px !important;
        }
        .token.date.number ,.token.time.number ,.token.number {
            font-size: 10px !important;
        }
    }
    code {
        font-size: 11px !important;
        line-height: 1.8 !important;
    }
    .language-log {
        color: #999999;
        &.error {
            color: #dc5229 !important;
            .token.date.number ,.token.time.number ,.token.number ,.token.string{
                color: #dc5229;
            }
        }
        &.info {
            color: #999999;
        }
        &.warning {
            color: #c7a24d !important;
            .token.date.number ,.token.time.number ,.token.number {
                color: #c7a24d;
            }
        }
    }
    .token {
        &.level.error.important {
            color: #dc5229;
        }
        &.string {
            color: #909e6a;    
        }
        &.warning {
            color: #c7a24d;
            font-weight: normal;
        }
        &.level.info.keyword {
            color: #666666;
            font-size: 11px !important;
        }
        &.property {
            color: #999999;
            font-weight: bold;
        }
        &.operator {
            color: #999999;
        }
        &.date.number {
            color: #4782b3;
            font-size: 11px !important;
        }
        &.time.number {
            color: #4782b3;
            font-size: 11px !important;
        }
        &.number {
            color: #4782b3;
            font-size: 11px !important;
        }
        &.ip-address.constant {
            color: #4782b3;
            font-size: 11px !important;
        }
    }
`

const AppLog = () => {
    const parentRef = useRef()
    const [logs, setLogs] = useState([]);
    const [selectLogFile, setSelectLogFile] = useState(null);
    const { data: logFiles } = useGetLogFiles();
    const { mutate: getLogLines, isLoading } = useGetLogLines();
    const rowVirtualizer = useVirtualizer({
        count: logs.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
    })

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
        if (isAutoScroll) {
            rowVirtualizer.scrollToIndex(logs.length - 1)
            // 猜测是因为虚拟滚动高度计算未完成 导致滚动不到底部
            // 无法识别到计算完成的事件 暴力解决 1s 后再滚动一次
            setTimeout(() => {
                rowVirtualizer.scrollToIndex(logs.length - 1)
            }, 1000)
        }
    }, [isAutoScroll, logs.length, rowVirtualizer])

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
            <FormControlLabel
                control={<Switch checked={isAutoScroll} onChange={(e) => setIsAutoScroll(e.target.checked)} />}
                label="自动滚动" />
            <FormControlLabel
                control={<Switch checked={isAutoRefresh} onChange={(e) => setIsAutoRefresh(e.target.checked)} />}
                label="自动刷新" />
        </Stack>
        <LogContainer
            ref={parentRef}
        >
            <div
                style={{
                    margin: 0,
                    height: rowVirtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative',
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => {
                    const rowLog = logs[virtualItem.index];
                    const rowHtml = Prism.highlight(rowLog, Prism.languages.log, 'log');
                    // 根据class名字获取日志等级
                    const isInfo = rowHtml.includes('class="token level info');
                    const isWarning = rowHtml.includes('class="token level warning');
                    const isError = rowHtml.includes('class="token level error');
                    const logLevel = isError ? 'error' : (isWarning ? 'warning' : (isInfo ? 'info' : 'none'));
                    return (
                        <code className={`language-log ${logLevel}`}
                            key={virtualItem.key}
                            data-index={virtualItem.index}
                            ref={rowVirtualizer.measureElement}
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                transform: `translateY(${virtualItem.start}px)`,
                                whiteSpace: 'pre-wrap',
                                border: 'unset',
                                borderRadius: 'unset',
                                boxShadow: 'unset',
                                padding: 'unset',
                                background: 'unset',
                                wordBreak: 'break-all'
                            }}
                        >
                            <span dangerouslySetInnerHTML={{ __html: Prism.highlight(logs[virtualItem.index], Prism.languages.log, 'log') }} />
                        </code>
                    )
                })}

            </div>
        </LogContainer>
    </Box>);
}
export default AppLog;
