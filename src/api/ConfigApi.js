import axios from "@/utils/request";
import useHttp from "@/hooks/useHttp";
import {useMutation} from "react-query";

export const saveFilterConfig = async (params) => {
    const result = await axios.post("/api/config/save_filter", params)
    return result;
}

export const getFilterConfig = async (filterName) => {
    const result = await axios.get("/api/config/get_filter", {params: {filter_name: filterName}})
    return result.data;
}
export const getFilterConfigList = async () => {
    const result = await axios.get("/api/config/get_filter_list")
    return result;
}
export const getRuleConfigList = async () => {
    const result = await axios.get("/api/config/get_rule_list")
    return result;
}
export const useDeleteFilterConfig = () => {
    const client = useHttp();
    return useMutation((params) =>
        client("/api/config/delete_filter", {params: params})
    );
};