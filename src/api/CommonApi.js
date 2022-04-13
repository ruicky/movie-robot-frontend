import axios from "../utils/request";

export const getAppInfo = async () => {
    const res = await axios.get("/api/common/app");
    return res.data;
}
