import useHttp from "@/hooks/useHttp";
import {useMutation} from "react-query";

export const useSubmitDownloadSubtitle = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/task/submit_download_subtitle", {params: params, method: "POST"})
    );
};