import React, { useRef, useImperativeHandle } from 'react'
import LogContainer from './LogContainer'
import { useVirtualizer } from '@tanstack/react-virtual';
import Prism from "prismjs";
import 'prismjs/components/prism-log.min.js'
import 'prismjs/themes/prism-twilight.min.css';

/** 日志高亮组件
 * @param {Array | String} props.logs
 * 
 * @param {boolean} props.handleBeforeHighlight
 */
function LogHighlight({ logs, handleBeforeHighlight = str => str }, ref) {
    const logsArr = Array.isArray(logs) ? logs : logs.split('\r\n')
    const parentRef = useRef()
    const rowVirtualizer = useVirtualizer({
        count: logsArr.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 100,
    })
    useImperativeHandle(ref, () => (
        {
            scrollToIndex: rowVirtualizer.scrollToIndex
        }
    ))

    return (
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
    )
}

export default React.forwardRef(LogHighlight)