import React, { useRef, useState, useImperativeHandle, useEffect, useCallback } from 'react'
import LogContainer from './LogContainer'
import { useVirtualizer } from '@tanstack/react-virtual';
import Prism from "prismjs";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import 'prismjs/components/prism-log.min.js'
import 'prismjs/themes/prism-twilight.min.css';
import { Fab, Fade } from "@mui/material";
import GlobalStyles from "@mui/material/GlobalStyles";
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import styled from "styled-components/macro";
import useThrottleFn from "@/hooks/useThrottleFn";
import useDebounceFn from "@/hooks/useDebounceFn";

Prism.languages.log.reason = {
    pattern: /「.+」|(是个)?\s*全集种子.+需要预分析可靠性.+|影视类型不等于.+|(解析到的.+)?\s*不符合.+|自动解析后.+不符合.+|解析.+不符合.+|过滤前.+过滤后.+|不包含设定的关键字\(.+\)|与.+不一致，跳过|解析季度为|用.+规则排序|特别优先关键字|没找到.+描述|已经提交下载|Plex Sort Out|Success!/,
    greedy: true
}
Prism.languages.log.site = {
    pattern: /ttg|HDHome|ssd|acgrip|audiences|beitai|btschool|chdbits|discfan|eastgame|exoticaz|filelist|gainbound|hares|hd4fans|hdarea|hdatmos|hdchina|hddolby|hdfans|hdhome|hdsky|hdtime|hdzone|iptorrents|joyhd|keepfrds|lemonhd|mikanani|mteam|nailuo|ourbits|pterclub|pthome|ptmsg|ptsbao|pttime|putao|rarbg|soulvoice|springsunday|tccf|tjupt|totheglory|U2/,
    greedy: true
}
Prism.languages.log.special = {
    pattern: /object.+no.+|http.+Error|anyio.+Error|Connect.+Error|timed out|All.+failed|Connect.+failed|Cannot.+|Errno \d+|No such process/,
    greedy: true
}

// 判断滚动条是否在边缘
const useScrollToEdgeHook = (
    listDomRef,
    reactionDistance = 0
) => {
    const [isTop, setIsTop] = useState(false)
    const [isBottom, setIsBottom] = useState(false)
    const [onScroll, setOnScroll] = useState(false)
    const currentDom = listDomRef.current
    const handleScrollEnd = useDebounceFn(() => {
        setOnScroll(false)
    }, 300)
    const handleScrollToEdge = useThrottleFn((e) => {
        if (e.target) {
            const { scrollTop, scrollHeight, offsetHeight } = e.target
            setIsTop(scrollTop <= reactionDistance)
            setIsBottom(scrollHeight - scrollTop - offsetHeight <= reactionDistance)
        }
    }, 300)
    const handleScroll = useCallback((e) => {
        setOnScroll(true)
        handleScrollToEdge(e)
        handleScrollEnd()
    }, [handleScrollEnd, handleScrollToEdge])
    useEffect(() => {
        currentDom?.addEventListener('scroll', handleScroll)
        return () => {
            currentDom?.removeEventListener('scroll', handleScroll)
        }
    }, [reactionDistance, listDomRef, currentDom, handleScroll])
    return [isTop, isBottom, onScroll]
}

const ActionButtons = styled.div`
    position: absolute;
    right: 18px;
    z-index: 220;
    display: grid;
    gap: 12px;
    grid-auto-flow: column;
    .MuiButtonBase-root{
        background-color: rgba(8, 8, 9, 0.99);
        color: rgba(255, 255, 255, 0.58);
        opacity: 0.99;
        width: 32px;
        height: 32px;
        min-height: 32px;
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.65);
        border: 1px solid rgba(222, 239, 245, 0.09);
    }
    // 按钮悬停高亮
    .MuiButtonBase-root:hover{
        background-color: rgba(29, 85, 187, 0.99);
        color: rgba(255, 255, 255, 0.75);
        box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.75);
        border: 1px solid rgba(255, 255, 255, 0.1);
    }
    // 移动端日志悬浮按钮
    @media (max-width: 600px) {
        right: 8px;
    }
`

const TopActionButtons = styled(ActionButtons)`
    top: 16px;
    ${(props) => props.theme.breakpoints.down("sm")} {
        right: ${(props) => props.isFullscreen ? '15px' : '8px'};
    }
`

const BottomActionButtons = styled(ActionButtons)`
    bottom: 16px;
    grid-auto-flow: row;
    ${(props) => props.theme.breakpoints.down("sm")} {
        bottom: ${(props) => props.isFullscreen ? '60px' : '16px'};
        right: ${(props) => props.isFullscreen ? '15px' : '8px'};
    }
`

function LogHighlight({
    logs,
    handleBeforeHighlight = str => str,
    style = {}, highlightLevelLine,
    showFullScreenButton = false
}, ref) {
    const logsArr = Array.isArray(logs) ? logs : logs.split('\n')
    const parentRef = useRef(null)
    const fullScreenRef = useRef(null)
    const rowVirtualizer = useVirtualizer({
        count: logsArr.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 50,
        paddingEnd: 20,
        overscan: 100,
    })
    const [isFakeFullscreen, setIsFakeFullscreen] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isTop, isBottom, onScroll] = useScrollToEdgeHook(parentRef, 100)
    const fullScreenStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1300,
        background: '#000'
    }
    const fullScreen = (el) => {
        const rfs = el && (el.requestFullScreen || el.webkitRequestFullScreen || el.mozRequestFullScreen || el.msRequestFullscreen)
        if (typeof rfs != "undefined" && rfs) {
            rfs.call(el);
        } else {
            setIsFakeFullscreen(true);
        }
        setIsFullscreen(true);
    }
    const exitFullscreen = () => {
        if (document.fullscreenElement) {
            document.exitFullscreen()
        } else {
            setIsFakeFullscreen(false);
        }
        setIsFullscreen(false);
    }
    useImperativeHandle(ref, () => (
        {
            scrollToIndex: rowVirtualizer.scrollToIndex,
            scrollParentRef: parentRef.current,
            fullScreen,
            exitFullscreen,
        }
    ))
    return (
        <div ref={fullScreenRef} style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            flex: 1,
            height: 200,
            ...(isFakeFullscreen ? fullScreenStyle : {})
        }}>
            <GlobalStyles
                styles={{
                    body: { overflow: 'hidden' }
                }}
            />
            <LogContainer
                highlightLevelLine={highlightLevelLine}
                ref={parentRef}
                style={{
                    ...style,
                    ...(isFakeFullscreen ? {
                        borderRadius: 0,
                    } : {})
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
            {showFullScreenButton && <Fade in={!onScroll}>
                <TopActionButtons isFullscreen={isFullscreen}>
                    {isFullscreen ?
                        <Fab size="small" onClick={() => exitFullscreen()}>
                            <FullscreenExitIcon />
                        </Fab>
                        :
                        <Fab size="small" onClick={() => fullScreen(fullScreenRef.current)}>
                            <FullscreenIcon />
                        </Fab>
                    }
                </TopActionButtons>
            </Fade>}
            <Fade in={!onScroll}>
                <BottomActionButtons isFullscreen={isFullscreen}>
                    {!isTop && <Fab size="small" onClick={() => {
                        rowVirtualizer.scrollToIndex(0, {
                            smoothScroll: true
                        })
                    }}>
                        <KeyboardArrowUpIcon />
                    </Fab>}
                    {!isBottom && <Fab size="small" onClick={() => {
                        rowVirtualizer.scrollToIndex(logsArr.length, {
                            smoothScroll: true
                        })
                    }}>
                        <KeyboardArrowDownIcon />
                    </Fab>}
                </BottomActionButtons>
            </Fade>
        </div>
    )
}

export default React.forwardRef(LogHighlight)
