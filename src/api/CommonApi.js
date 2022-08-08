import axios from "../utils/request";
import useHttp from "@/hooks/useHttp";
import {useMutation, useQuery} from "react-query";

export const getAppInfo = async () => {
    const res = await axios.get("/api/common/app");
    return res.data;
}
export const getScoreRuleNames = async () => {
    let res = await axios.get("/api/common/rules")
    return res.data;
}
export const getFilterOptions = async () => {
    let res = await axios.get("/api/common/filter_options")
    return res.data;
}
export const useGetFilterOptions = (param) => {
    const client = useHttp();
    return useQuery(['get_filter_options', param], () =>
        client("/api/common/filter_options", {params: param})
    );
}
export const useGetDailyMedia = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/common/daily_media", {method: "GET"})
    );
};
export const useRestartApp = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/common/restart_app", {params: params, method: "GET"})
    );
};
export const useGetDirs = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/common/get_dirs", {params: params, method: "GET"})
    );
};