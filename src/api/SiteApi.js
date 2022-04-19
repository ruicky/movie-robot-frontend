import axios from "@/utils/request";

export const getSiteSharesData = async () => {
    const result = await axios.get("/api/site/get_site_shares_data");
    return result;
}