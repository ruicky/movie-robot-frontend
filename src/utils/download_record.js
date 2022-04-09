import axios from "./request";
import {STATUS} from "@/constants";

/**
 * 删除记录
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteRecord = async (id) => {
    const result = await axios.get("/api/download/delete_record", {
        params: {id: id}
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
export const getRecordList = async () => {
    const result = await axios.get("/api/download/record_list");
    const list = [];
    // 数据处理
    for (let r of result.data) {
        let desc = r.download_status === 3 ? r.torrent_subject : r.desc;
        if (desc === undefined || desc === null) {
            desc = "暂无";
        }
        list.push({
            id: r.id,
            title: r.movie_name,
            tname: r.torrent_name,
            site_name: r.site_name,
            movie_type: r.movie_type,
            image: r.thumb_image_url,
            status: STATUS[r.download_status].msg,
            status_color: STATUS[r.download_status].color,
            status_code: r.download_status,
            desc: desc,
            year: r.movie_year,
            hash: r.torrent_hash,
            media_source: r.media_source,
            resolution: r.resolution,
            media_encoding: r.media_encoding,
            url: r.url
        });
    }
    return list;
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

export const getTorrentInfo = async (torrent_hash) => {
    const result = await axios.get("/api/download/get_torrent_info", {
        params: {torrent_hash}
    });
    return result;
}