import axios from "../utils/request";
import useHttp from "@/hooks/useHttp";
import {useMutation} from "react-query";

export const getUserList = async () => {
    const result = await axios.get("/api/user/get_user_list")
    return result.data;
}
export const getUserOptions = async () => {
    const result = await axios.get("/api/user/get_user_options")
    return result.data;
}
export const getUser = async (id) => {
    const result = await axios.get("/api/user/get_user", {params: {id}})
    return result.data;
}
export const registerUser = async (username, password, nickname, role, douban_user, qywx_user, pushdeer_key, bark_url, score_rule_name, permission_category,telegram_user_id) => {
    const result = await axios.post("/api/user/register", {
        username,
        password,
        nickname,
        role,
        douban_user,
        qywx_user,
        pushdeer_key,
        bark_url,
        score_rule_name,
        permission_category,
        telegram_user_id
    })
    return result;
}
export const updateUser = async (uid, username, nickname, new_password, role, douban_user, qywx_user, pushdeer_key, bark_url, score_rule_name, permission_category,telegram_user_id) => {
    const result = await axios.post("/api/user/update_user", {
        uid, username, nickname, new_password, role, douban_user, qywx_user,
        pushdeer_key,
        bark_url,
        score_rule_name,
        permission_category,
        telegram_user_id
    })
    return result;
}
export const getUnreadSysNotify = async () => {
    const result = await axios.get("/api/user/get_unread_sys_notify")
    return result.data;
}
export const countUnreadSysNotify = async () => {
    const result = await axios.get("/api/user/count_unread_sys_notify")
    return result.data;
}
export const getAllSysNotify = async () => {
    const result = await axios.get("/api/user/get_all_sys_notify")
    return result.data;
}
export const clearSysNotify = async () => {
    const result = await axios.get("/api/user/clear_sys_notify")
    return result;
}

export const useInviteEmail = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/auth/invite_email", {params: params, method: "POST"})
    );
};

export const useDeleteUser = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/user/delete_user", {params: params, method: "POST"})
    );
};
export const useUpdateRemoteNickname = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/user/upload_nickname", {params: params, method: "GET"})
    );
};