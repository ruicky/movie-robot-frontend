import axios from "axios";
import message from "@/utils/message";

const axiosInstance = axios.create({
    baseURL: 'http://82.156.208.110:4070',
    timeout: 60000,
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
