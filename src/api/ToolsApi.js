import useHttp from "@/hooks/useHttp";
import {useMutation} from "react-query";

export const useTestReplaceText = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/tools/test_replace_text", {params: params, method: "GET"})
    );
};