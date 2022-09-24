import React, {useEffect, useState} from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";
import DoubanRanking from "@/pages/recommend/components/DoubanRanking";
import SubscribeTrendingDialog from "@/pages/recommend/components/SubscribeTrendingDialog";
import {useGetSubDatasetList} from "@/utils/subscribe";
import DeleteSubTrendingDialog from "@/pages/recommend/components/DeleteSubTrendingDialog";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";


const MovieRankingList = () => {
    const [subLogData, setSubLogData] = useState(null);
    const {data: subList, refetch} = useGetSubDatasetList({data_type: 'Trending'});
    const [subDataType, setSubDataType] = useState([]);
    const [subTrendingData, setSubTrendingData] = useState({
        trendingType: null,
        trendingName: null
    });
    const [deleteSubData, setDeleteSubData] = useState({
        trendingType: null,
        trendingName: null
    });
    useEffect(() => {
        if (subList?.data) {
            setSubDataType(subList.data.map((item) => {
                return item.data_key;
            }))
        }
    }, [subList])
    const isSub = (trendingType) => {
        return !(subDataType && subDataType.includes(trendingType));
    }
    const onSub = (trendingType, trendingName) => {
        setSubTrendingData({
            trendingType, trendingName
        });
    }
    const onDelete = (trendingType, trendingName) => {
        setDeleteSubData({
            trendingType, trendingName
        });
    }
    const onComplete = () => {
        refetch()
    }
    return (
        <>
            <Helmet title="电影榜单"/>
            <PageTitle text="近期热门电影"/>
            <FilterOptionsProvider>
                <SubLogDialog subId={subLogData?.subId}
                              title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                              open={Boolean(subLogData)}
                              handleClose={() => setSubLogData(null)}/>
                <DeleteSubTrendingDialog open={Boolean(deleteSubData?.trendingType)} data={deleteSubData}
                                         onComplete={onComplete}
                                         onClose={() => {
                                             setDeleteSubData({
                                                 trendingType: null, trendingName: null
                                             })
                                         }}/>
                <SubscribeTrendingDialog open={Boolean(subTrendingData?.trendingType)} data={subTrendingData}
                                         onComplete={onComplete}
                                         handleClose={() => {
                                             setSubTrendingData({
                                                 trendingType: null, trendingName: null
                                             })
                                         }}/>
                <DoubanRanking
                    title="实时热门电影" trendingType="movie_real_time_hotest" trendingName="实时热门电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub("movie_real_time_hotest")}
                    showSubLogs={setSubLogData}
                />
                <DoubanRanking
                    title="近期热门电影" trendingType="ECPE465QY" trendingName="近期热门电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub("ECPE465QY")}
                    showSubLogs={setSubLogData}
                />
                <DoubanRanking
                    title="一周高分电影" trendingType="movie_weekly_best" trendingName="一周高分电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub("movie_weekly_best")}
                    showSubLogs={setSubLogData}
                />
                <DoubanRanking
                    title="近期高分电影" trendingType="EC7Q5H2QI" trendingName="近期高分电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub("EC7Q5H2QI")}
                    showSubLogs={setSubLogData}
                />
            </FilterOptionsProvider>
        </>
    )
}

export default MovieRankingList