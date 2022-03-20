import React, {useEffect, useRef} from "react";

/**
 * 定时器 hook
 * @param callback 调用方法
 * @param delay 延迟时间(单位毫秒)
 */
export function useInterval(callback,delay) {
  const savedCallback = useRef();

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    function tick() {
      savedCallback.current();
    }

    if (delay !== null) {
      let id = setInterval(tick, delay);
      return () => clearInterval(id);
    }
  }, [delay]);
}
