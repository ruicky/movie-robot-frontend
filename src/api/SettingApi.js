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
export const useGetNotifySetting = (param) => {
    const client = useHttp();
    return useQuery(['getNotifySetting', param], () =>
        client("/api/setting/get_notify", {params: param, method: "GET"})
    );
};
export const useSaveNotify = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_notify", {params: params, method: "POST"})
    );
};
export const useSetNotifyEnable = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/set_notify_enable", {params: params, method: "POST"})
    );
};
export const useTestNotify = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/test_notify", {params: params, method: "POST"})
    );
};
export const useSetFreeDownloadEnable = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/set_free_download_enable", {params: params, method: "POST"})
    );
};
export const useSaveFreeDownload = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_free_download", {params: params, method: "POST"})
    );
};
export const useGetFreeDownloadSetting = (param) => {
    const client = useHttp();
    return useQuery(['getFreeDownloadSetting', param], () =>
        client("/api/setting/get_free_download", {params: param, method: "GET"})
    );
};
export const useGetSettingStatus = (param) => {
    const client = useHttp();
    return useQuery(['getSettingStatus', param], () =>
        client("/api/setting/get_status", {params: param, method: "GET"})
    );
};
export const useSetSubtitleEnable = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/set_subtitle_enable", {params: params, method: "POST"})
    );
};
export const useGetSubtitleSetting = (param) => {
    const client = useHttp();
    return useQuery(['getSubtitleSetting', param], () =>
        client("/api/setting/get_subtitle", {params: param, method: "GET"})
    );
};
export const useSaveSubtitle = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_subtitle", {params: params, method: "POST"})
    );
};
export const useGetServerSetting = (param) => {
    const client = useHttp();
    return useQuery(['getWebSetting', param], () =>
        client("/api/setting/get_server_setting", {params: param, method: "GET"})
    );
};
export const useSaveServerSetting = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/setting/save_server_setting", {params: params, method: "POST"})
    );
};