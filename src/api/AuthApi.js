import useHttp from "@/hooks/useHttp";
import {useQuery} from "react-query";

export const useGetLicenseDetail = (param) => {
    const client = useHttp();
    return useQuery(['getLicenseDetail', param], () =>
        client("/api/auth/get_license_detail", {params: param})
    );
}