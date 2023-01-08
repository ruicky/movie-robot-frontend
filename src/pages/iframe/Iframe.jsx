import React, { useRef, useCallback, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const scrollbarCss = `
/* 滚动槽 */
::-webkit-scrollbar {
    width: 8px;
    height: 8px;
}
::-webkit-scrollbar-track {
    // border-radius: 5px;
    background: rgba(158, 158, 158, 0.185);
    box-shadow: inset 0 0 0px #000000;
}
/* 滚动条滑块 */
::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #ffffff80;
}
`

// {"href":"/Iframe/index?hidePadding=true#/static/tv_calendar.html","icon":"Settings","title":"追剧日历"}

// 判断是否是绝对路径
function isAbsoluteUrl(url) {
    return url.indexOf('://') > 0 || url.indexOf('//') === 0
}

// 相对路径转绝对路径
function getAbsoluteUrl(relativeUrl) {
    const url = new URL(relativeUrl, window.location.href)
    return url.href
}

// 绝对路径转相对路径
function getRelativeUrl(absoluteUrl) {
    if (!isAbsoluteUrl(absoluteUrl)) return absoluteUrl
    const url = new URL(absoluteUrl)
    return url.pathname + url.search
}

// 注入css
const injectCss = (contentIFrameRef) => {
    try {
        const style = document.createElement('style')
        style.innerHTML = scrollbarCss
        contentIFrameRef.current.contentDocument.head.appendChild(style)
    } catch (error) {
        console.log('injectCss error', error)
    }
}

// 更新query参数
const updateHash = (contentIFrameRef) => {
    const href = contentIFrameRef.current.contentWindow.location.href
    window.location.hash = '#' + getRelativeUrl(href)
}

function Iframe() {
    const contentIFrameRef = useRef(null)
    const location = useLocation()

    // 监听hash变化
    useEffect(() => {
        const handleHashChange = () => {
            const iframeHref = contentIFrameRef.current.contentWindow.location.href
            const nowHref = getAbsoluteUrl(location.hash.slice(1))
            if (iframeHref === nowHref) return
            contentIFrameRef.current.contentWindow.location.href = nowHref
        }
        handleHashChange()
    }, [location])

    const handleOnload = useCallback(() => {
        if (!contentIFrameRef.current) return
        updateHash(contentIFrameRef)
        injectCss(contentIFrameRef)
    }, [contentIFrameRef,])

    return (
        <iframe ref={contentIFrameRef}
            onLoad={handleOnload}
            style={{
                border: 'none',
                height: '100%',
                width: '100%'
            }} />
    )
}

export default Iframe