import { useCallback } from "react";
import axios from "@/utils/request";

const useHttp = () => {
  return useCallback(
    (...[endpoint, config]) =>
      (config?.method?.toUpperCase()  === "POST"
        ? axios.post(endpoint, config)
        : axios.get(endpoint, config)),
    []
  );
};

export default useHttp;

