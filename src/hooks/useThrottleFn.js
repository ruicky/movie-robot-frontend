import React from 'react'

// 节流
const useThrottleFn = (fn, delay, option) => {
    const { leading, trailing } = option || { leading: false, trailing: true }
    const { current } = React.useRef({ fn, timer: null });
    React.useEffect(() => {
        current.fn = fn;
    }, [current, fn]);
    return React.useCallback(
        (...args) => {
            if (!current.timer) {
                if (leading) {
                    current.fn(...args);
                }
                current.timer = setTimeout(() => {
                    if (trailing) {
                        current.fn(...args);
                    }
                    current.timer = null;
                }, delay);
            }
        },
        [current, delay, leading, trailing]
    );
}

export default useThrottleFn