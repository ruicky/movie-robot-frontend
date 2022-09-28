import React, {useEffect, useState} from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import DoubanRanking from "@/pages/recommend/components/DoubanRanking";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";
import {useGetSubDatasetList} from "@/utils/subscribe";
import DeleteSubTrendingDialog from "@/pages/recommend/components/DeleteSubTrendingDialog";
import SubscribeTrendingDialog from "@/pages/recommend/components/SubscribeTrendingDialog";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";


const TvRankingList = () => {
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
            <Helmet title="剧集榜单"/>
            <PageTitle text="近期热门剧集"/>
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
                <DoubanRanking title="国产剧" trendingType="tv_domestic" trendingName="热门国产剧"
                               onSub={onSub}
                               onDelete={onDelete}
                               isSub={isSub("tv_domestic")}
                               showSubLogs={setSubLogData}
                />
                <DoubanRanking title="欧美剧" trendingType="tv_american" trendingName="热门欧美剧"
                               onSub={onSub}
                               onDelete={onDelete}
                               isSub={isSub("tv_american")}
                               showSubLogs={setSubLogData}
                />
                <DoubanRanking title="日剧" trendingType="tv_japanese" trendingName="热门日剧"
                               onSub={onSub}
                               onDelete={onDelete}
                               isSub={isSub("tv_japanese")}
                               showSubLogs={setSubLogData}
                />
                <DoubanRanking title="韩剧" trendingType="tv_korean" trendingName="热门韩剧"
                               onSub={onSub}
                               onDelete={onDelete}
                               isSub={isSub("tv_korean")}
                               showSubLogs={setSubLogData}
                />
                <DoubanRanking title="动漫" trendingType="tv_animation" trendingName="热门动漫"
                               onSub={onSub}
                               onDelete={onDelete}
                               isSub={isSub("tv_animation")}
                               showSubLogs={setSubLogData}
                />
            </FilterOptionsProvider>
        </>
    )
}

export default TvRankingList