import axios from "../utils/request";

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