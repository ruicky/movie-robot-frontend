import {useMutation, useQuery, useQueryClient} from "react-query";
import useHttp from "@/hooks/useHttp";
import axios from "@/utils/request";

// 订阅列表
export const useSubscribes = (param) => {
    const client = useHttp();
    return useQuery(['subscribes', param], () =>
        client("/api/subscribe/list", {params: param})
    );
}

// 订阅搜索
export const useSubscribeSearch = () => {
    const client = useHttp();
    return useMutation((params) =>
        client("/api/movie/search_douban", {params: params})
    );
};

// 添加订阅
export const useAddSubscribe = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/subscribe/sub_douban", {params: params})
    );
};

// 删除订阅
export const useDeleteSubscribe = () => {
    const client = useHttp();
    const queryClient = useQueryClient();
    return useMutation(
        (params) =>
            client("/api/subscribe/delete_sub", {params: params}),
        {
            onSuccess: () => queryClient.invalidateQueries(['subscribes', null]),
        }
    );
};

// 洗版
export const useReVersionSubscribe = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/subscribe/re_version", {params: params, method: "POST"})
    );
};

export const getSub = async (id) => {
    let res = await axios.get("/api/subscribe/get_sub", {params: {id}})
    return res.data;
}