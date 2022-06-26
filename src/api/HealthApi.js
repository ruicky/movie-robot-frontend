import useHttp from "@/hooks/useHttp";
import {useMutation, useQuery} from "react-query";

export const useGetHealth = (param) => {
    const client = useHttp();
    return useQuery(['get_health', param], () =>
        client("/api/health/get_health", {params: param})
    );
}
export const useGetHealthIndicator = (param) => {
    const client = useHttp();
    return useQuery(['get_health_indicator', param], () =>
        client("/api/health/get_health_indicator", {params: param})
    );
}