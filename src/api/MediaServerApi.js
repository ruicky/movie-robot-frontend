import useHttp from "@/hooks/useHttp";
import {useMutation, useQuery} from "react-query";

export const useMediaSearch = (param) => {
    const client = useHttp();
    return useQuery(['mediaSearch', param], () =>
        client("/api/media/search_by_keyword", {params: param})
    );
};
export const useGetMediaStreams = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/media/get_media_streams", {params: params, method: "GET"})
    );
};