// 订阅列表
import useHttp from "@/hooks/useHttp";
import {useQuery} from "react-query";

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