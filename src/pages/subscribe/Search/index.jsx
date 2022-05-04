import React, {useEffect, useState} from 'react';
import {useUrlQueryParam} from "@/hooks/useUrlQueryParam";
import {useSubscribeSearch} from "@/utils/subscribe";
import message from "@/utils/message";
import {Helmet} from "react-helmet-async";
import PageTitle from "@/components/PageTitle";
import SearchListView from "@/pages/subscribe/Search/list";
import {getFilterConfigList} from "@/api/ConfigApi";

const Search = () => {
    const [param, setParam] = useUrlQueryParam(["keyword"]);
    const [searchList, setSearchList] = React.useState([]);
    const {mutate: search, searchIsLoading} = useSubscribeSearch();
    const [filterNameList, setFilterNameList] = useState([]);
    const fetchFilterNameListList = () => {
        getFilterConfigList().then(r => {
            if (r.code === 0) {
                setFilterNameList(r.data.map((item) => {
                    return item.filter_name;
                }))
            }
        })
    }
    const onSearch = (keyword) => {
        setParam({...param, keyword})
        search({keyword}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setSearchList(data);
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }
    useEffect(() => {
        if (param.keyword) {
            onSearch(param.keyword)
            fetchFilterNameListList()
        }
    }, [param])
    return (
        <>
            <Helmet title={param.keyword ? param.keyword + " 的搜索结果" : "搜索结果"}/>
            <PageTitle text={param.keyword ? param.keyword + " 的搜索结果" : "搜索结果"}/>
            {
                param?.keyword && <SearchListView
                    items={searchList}
                    isLoading={searchIsLoading}
                    filterNameList={filterNameList}
                />
            }
        </>
    );

};
const SearchPage = () => {
    return <Search/>;
};

export default SearchPage;
