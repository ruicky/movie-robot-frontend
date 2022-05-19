import useHttp from "@/hooks/useHttp";
import {useQuery} from "react-query";

export const useMediaSearch = (param) => {
    const client = useHttp();
    return useQuery(['mediaSearch', param], () =>
        client("/api/media/search_by_keyword", {params: param})
    );
};