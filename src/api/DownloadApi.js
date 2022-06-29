import axios from "../utils/request";
import useHttp from "@/hooks/useHttp";
import {useMutation} from "react-query";

/**
 * 删除记录
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRecord = async (params) => {
    const result = await axios.get("/api/download/delete_record", {
        params
    })
    return result;
}

/**
 * 获取下载动态
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDownloading = async () => {
    const result = axios.get("/api/download/downloading");
    return result
}

/**
 * 获取下载记录列表
 * @returns {Promise<*[]>}
 */
export const getRecordList = async (start = 0) => {
    const result = await axios.get("/api/download/record_list?start=" + start);
    return result;
}

/**
 * 重新识别
 * @param params {id,name,year,send_notify:1|0}
 * @returns {Promise<void>}
 */
export const reanalyze = async (params) => {
    const result = await axios.get("/api/download/reanalyse", {
        params
    });
    return result;
}

export const getRecord = async (id) => {
    const result = await axios.get("/api/download/get_record", {
        params: {id}
    });
    return result;
}

export const getRecordDashboard = async () => {
    const result = await axios.get("/api/download/record_dashboard");
    return result;
}

export const useReLink = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/download/relink", {params: params, method: "GET"})
    );
};