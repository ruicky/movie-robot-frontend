import { useState, useRef, useEffect } from 'react'
import mockLogsRaw from './logs.txt?raw'
import { useVirtualizer } from '@tanstack/react-virtual';
import { Switch } from '@mui/material'
import { useInterval } from '../../hooks/useInterval';
import Prism from "prismjs";
import 'prismjs/components/prism-log.min.js'
import './index.css'
import 'prismjs/themes/prism-twilight.min.css';

function Index() {
    const parentRef = useRef()
    const [logs, setLogs] = useState(mockLogsRaw)

    const logsArr = logs.split('\n')
    const rowVirtualizer = useVirtualizer({
        count: logsArr.length,
        getScrollElement: () => parentRef.current,
        estimateSize: () => 35,
    })

    const [isAutoScroll, setIsAutoScroll] = useState(false)
    const [isAutoRefresh, setIsAutoRefresh] = useState(false)

    // 模拟日志增长
    useInterval(() => {
        if (isAutoRefresh) {
            setLogs(logs => {
                return logs + logsArr[Math.floor(Math.random() * 100)] + '\n'
            })
        }
    }, 1000)

    useEffect(() => {
        if (isAutoScroll) {
            rowVirtualizer.scrollToIndex(logsArr.length - 1)
        }
    }, [logsArr.length, isAutoScroll, rowVirtualizer])

    return <div className='container'>
        <div className='setting'>
            自动滚动 <Switch checked={isAutoScroll} onChange={(e) => setIsAutoScroll(e.target.checked)} />
            自动刷新 <Switch checked={isAutoRefresh} onChange={(e) => setIsAutoRefresh(e.target.checked)} />
        </div>
        <div
            ref={parentRef}
            className='logs'
        >
            <div
                style={{
                    margin: 0,
                    height: rowVirtualizer.getTotalSize(),
                    width: '100%',
                    position: 'relative',
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualItem) => (
                    <code className={`language-log`}
                        key={virtualItem.key}
                        data-index={virtualItem.index}
                        ref={rowVirtualizer.measureElement}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            transform: `translateY(${virtualItem.start}px)`,
                            whiteSpace: 'pre-wrap'
                        }}
                    >
                        <span dangerouslySetInnerHTML={{ __html: Prism.highlight(logsArr[virtualItem.index], Prism.languages.log, 'log') }} />
                    </code>
                ))}

            </div>
        </div>
    </div >
}

export default Index