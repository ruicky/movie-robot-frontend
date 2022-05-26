import axios from "../utils/request";
import useHttp from "@/hooks/useHttp";
import {useMutation} from "react-query";

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
export const getJuzi = async () => {
    let res = await axios.get("/api/common/juzi")
    return res.data;
}
export const useGetJuzi = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/common/juzi", {method: "GET"})
    );
};
export const useRestartApp = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/common/restart_app", {params: params, method: "GET"})
    );
};