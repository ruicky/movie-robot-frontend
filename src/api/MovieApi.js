// 订阅列表
import useHttp from "@/hooks/useHttp";
import {useMutation, useQuery} from "react-query";

export const useMovieDimension = () => {
    const client = useHttp();
    return useQuery(['movieDimension'], () =>
        client("/api/movie/dimension")
    );
}

export const useDoubanRanking = (param) => {
    const client = useHttp();
    return useQuery(['doubanRanking', param], () =>
        client("/api/movie/douban_rank_list", {params: param})
    );
}
export const useGetDoubanSuggestion = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/movie/douban_suggestion", {params: params, method: "GET"})
    );
};

export const useSearchKeywordCache = (param) => {
    const client = useHttp();
    return useQuery(['getSearchKeywordCache', param], () =>
        client("/api/movie/get_search_keyword_cache", {params: param, method: "GET"})
    );
};