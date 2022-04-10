import axios from "../utils/request";

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
export const registerUser = async (username, password, nickname, role, douban_user, qywx_user) => {
    const result = await axios.post("/api/user/register", {
        username,
        password,
        nickname,
        role,
        douban_user,
        qywx_user
    })
    return result;
}
export const updateUser = async (uid, new_password, role, douban_user, qywx_user) => {
    const result = await axios.post("/api/user/update_user", {uid, new_password, role, douban_user, qywx_user})
    return result;
}