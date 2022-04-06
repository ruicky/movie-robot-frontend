import axios from "axios";
import message from "@/utils/message";

const axiosInstance = axios.create({
    baseURL: '',
    timeout: 30000,
    headers: {},
});
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;
    return {...res, response};
  },
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;
