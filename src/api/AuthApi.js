import useHttp from "@/hooks/useHttp";
import {useMutation, useQuery} from "react-query";

export const useGetLicenseDetail = (param) => {
    const client = useHttp();
    return useQuery(['getLicenseDetail', param], () =>
        client("/api/auth/get_license_detail", {params: param})
    );
}
export const useCreateAccessKey = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/auth/create_access_key", {params: params, method: "GET"})
    );
};
export const useDeleteAccessKey = (param) => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/auth/delete_access_key", {params: params, method: "GET"})
    );
};
export const useListAccessKey = (param) => {
    const client = useHttp();
    return useQuery(['list_access_key', param], () =>
        client("/api/auth/list_access_key", {params: param})
    );
};