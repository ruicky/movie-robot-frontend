import React, {useEffect, useRef} from "react";

/**
 * 定时器 hook
 * @param callback 调用方法
 * @param delay 延迟时间(单位毫秒)
 */
export function useInterval(cb, delay) {
  const ref = useRef()

  useEffect(() => {
    ref.current = cb
  })

  useEffect(() => {
    const timer = setInterval(() => ref.current(), delay)
    return () => clearInterval(timer)
  }, [delay])
}
