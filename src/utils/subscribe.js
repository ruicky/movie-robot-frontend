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
export const useSubCustomList = (param) => {
    const client = useHttp();
    return useQuery(['get_sub_custom_list', param], () =>
        client("/api/subscribe/get_sub_custom_list", {params: param})
    );
}
export const useSubCustom = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/subscribe/sub_custom", {params: params, method: "POST"})
    );
};
export const useGetSubCustom = (param) => {
    const client = useHttp();
    return useMutation((params) =>
        client("/api/subscribe/get_sub_custom", {params: params})
    );
};
export const useDeleteSubCustom = () => {
    const client = useHttp();
    return useMutation((params) =>
        client("/api/subscribe/delete_sub_custom", {params: params})
    );
};
// 订阅搜索
export const useSubscribeSearch = () => {
    const client = useHttp();
    return useMutation((params) =>
        client("/api/movie/search_douban", {params: params})
    );
};
export const useSubscribeSearchQuery = (param) => {
    const client = useHttp();
    return useQuery(['subscribesSearchQuery', param], () =>
        client("/api/movie/search_douban", {params: param})
    );
};

// 添加订阅
export const useAddSubscribe = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/subscribe/sub_douban", {params: params, method: "POST"})
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

export const useRunSubDownload = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/subscribe/run_download", {params: params, method: "POST"})
    );
};