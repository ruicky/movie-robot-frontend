import { useQuery,useMutation, useQueryClient } from "react-query";
import useHttp from "@/hooks/useHttp";

// 订阅列表
export const useSubscribes = (param) => {
  const client = useHttp();
  return useQuery(['subscribes', param], () =>
    client("/api/subscribe/list", {params: param })
  );
}

// 订阅搜索
export const useSubscribeSearch = (param) => {
  const client = useHttp();
  return useQuery(['subscribes-search', param], () =>
    client("/api/movie/search_douban", {params: param })
  );
};

// 添加订阅
export const useAddSubscribe = () => {
  const client = useHttp();
  return useMutation(
    (params) =>
      client("/api/subscribe/sub_douban", { params: params })
  );
};

// 删除订阅
export const useDeleteSubscribe = () => {
  const client = useHttp();
  const queryClient = useQueryClient();
  return useMutation(
    (params) =>
      client("/api/subscribe/delete_sub", { params: params }),
      {
        onSuccess: () => queryClient.invalidateQueries(['subscribes', null]),
      }
  );
};