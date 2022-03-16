import axios from "axios";

const axiosInstance = axios.create({
    baseURL: 'http://192.168.1.10:1329',
    timeout: 30000,
    headers: {},
});
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) =>
        Promise.reject(
            (error.response && error.response.data) || "Something went wrong"
        )
);

export default axiosInstance;