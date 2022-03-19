import axios from "axios";
import message from "@/utils/message";

const axiosInstance = axios.create({
    baseURL: 'http://82.156.208.110:4070',
    timeout: 30000,
    headers: {},
});
axiosInstance.interceptors.response.use(
  (response) => {
    const res = response.data;
    if (res.code !== 0) {
      message.error(res.message || "操作失败");
      return Promise.reject(new Error(res.message || "Error"));
    } else {
      return {...res, response};
    }
  },
  (error) =>
    Promise.reject(
      (error.response && error.response.data) || "Something went wrong"
    )
);

export default axiosInstance;
