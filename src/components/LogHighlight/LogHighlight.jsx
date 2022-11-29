import React, { useRef, useImperativeHandle } from 'react'
import LogContainer from './LogContainer'
import { useVirtualizer } from '@tanstack/react-virtual';
import Prism from "prismjs";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useScrollTrigger from '@mui/material/useScrollTrigger';
import 'prismjs/components/prism-log.min.js'
import 'prismjs/themes/prism-twilight.min.css';
import { Box, Fade, Fab } from "@mui/material";

function ScrollTop(props) {
    const { children, target, scrollToTop } = props;
    const trigger = useScrollTrigger({
        target: target.current || undefined,
        disableHysteresis: true,
        threshold: 100,
    });
    return (
        <Fade in={trigger}>
            <Box
                onClick={scrollToTop}
                role="presentation"
                sx={{ position: 'absolute', bottom: 16, right: 24 }}
            >
                {children}
            </Box>
        </Fade >
    );
}

/** 日志高亮组件
 * @param {Array | String} props.logs
 * 
 * @param {boolean} props.handleBeforeHighlight
 */
function LogHighlight({ logs, handleBeforeHighlight = str => str, style, highlightLevelLine }, ref) {
    const logsArr = Array.isArray(logs) ? logs : logs.split('\n')
    const parentRef = useRef()
    const rowVirtualizer = useVirtualizer({
        count: logsArr.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
        paddingEnd: 50,
        overscan: 5,
    })
    useImperativeHandle(ref, () => (
        {
            scrollToIndex: rowVirtualizer.scrollToIndex,
            scrollParentRef: parentRef.current
        }
    ))
    return (
        <div style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: 400,
        }}>
            <LogContainer
                highlightLevelLine={highlightLevelLine}
                ref={parentRef}
                style={{

                    ...style,
                }}
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
                        const rowLog = handleBeforeHighlight(logsArr[virtualItem.index]);
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
                                <span dangerouslySetInnerHTML={{ __html: rowHtml }} />
                            </code>
                        )
                    })}
                </div>
            </LogContainer>
            <ScrollTop target={parentRef} scrollToTop={() => {
                rowVirtualizer.scrollToIndex(0)
            }}>
                <Fab size="small" aria-label="scroll back to top">
                    <KeyboardArrowUpIcon />
                </Fab>
            </ScrollTop>
        </div>
    )
}

export default React.forwardRef(LogHighlight)