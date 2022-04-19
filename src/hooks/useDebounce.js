import React,{useState,useEffect} from 'react'

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    // 每次在 value 变化以后，设置一个定时器
    const timeout = setTimeout(() => setDebouncedValue(value), delay);
    // 每次在上一个 useEffect 处理完以后在运行
    return () => clearTimeout(timeout);
  }, [value, delay]);
  return debouncedValue;
};


export default useDebounce;
