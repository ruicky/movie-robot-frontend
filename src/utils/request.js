import axios from "axios";

const axiosInstance = axios.create({
    baseURL: '',
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
