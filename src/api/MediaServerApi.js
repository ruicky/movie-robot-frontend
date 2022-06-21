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
export const useGetMediaLibrary = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/media/get_media_library", {params: params, method: "GET"})
    );
};
export const useGetMediaLinkStatus = (param) => {
    const client = useHttp();
    return useQuery(['get_media_link_status', param], () =>
        client("/api/media/get_media_link_status", {params: param})
    );
};
export const useLinkMedia = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/media/link_media", {params: params, method: "POST"})
    );
};