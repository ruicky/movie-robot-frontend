import useHttp from "@/hooks/useHttp";
import {useMutation, useQuery} from "react-query";

export const useGetMediaServer = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/get_media_server", {params: params, method: "GET"})
    );
};
export const useSaveMediaServer = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_media_server", {params: params, method: "POST"})
    );
};
export const useGetDownloadClient = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/get_download_client", {params: params, method: "GET"})
    );
};
export const useSaveDownloadClient = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_download_client", {params: params, method: "POST"})
    );
};
export const useDeleteDownloadClient = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/delete_download_client", {params: params, method: "GET"})
    );
};
export const useGetMovieMetadata = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/get_movie_metadata", {params: params, method: "GET"})
    );
};
export const useDeleteMediaServer = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/delete_media_server", {params: params, method: "GET"})
    );
};
export const useSaveTmdb = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_tmdb", {params: params, method: "POST"})
    );
};
export const useSaveFanArt = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_fanart", {params: params, method: "POST"})
    );
};
export const useSaveDouban = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_douban", {params: params, method: "POST"})
    );
};
export const useGetWeb = (param) => {
    const client = useHttp();
    return useQuery(['getWebSetting', param], () =>
        client("/api/setting/get_web", {params: param, method: "GET"})
    );
};
export const useSaveWeb = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_web", {params: params, method: "POST"})
    );
};