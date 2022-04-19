import { useUrlQueryParam } from "@/hooks/useUrlQueryParam";
import { useMemo } from "react";

// 搜索
export const useSubscribeSearchParams = () => {
  const [param, setParam] = useUrlQueryParam(["keyword"]);
  return [
    useMemo(
      () => ({ ...param }),
      [param]
    ),
    setParam,
  ];
};

