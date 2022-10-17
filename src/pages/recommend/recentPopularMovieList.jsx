import React, {useEffect, useState} from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import DoubanRanking from "@/pages/recommend/components/DoubanRanking";
import {FilterOptionsProvider} from "@/contexts/FilterOptionsProvider";
import {useGetSubDatasetList} from "@/utils/subscribe";
import DeleteSubTrendingDialog from "@/pages/recommend/components/DeleteSubTrendingDialog";
import SubscribeTrendingDialog from "@/pages/recommend/components/SubscribeTrendingDialog";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";


const RecentPopularMovieList = () => {
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
            <Helmet title="分类热门电影"/>
            <PageTitle text="分类热门电影"/>
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
                    title="科幻" trendingType="ECZYOJPLI" trendingName="热门科幻电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub("ECZYOJPLI")}
                    showSubLogs={setSubLogData}
                />
                <DoubanRanking
                    title="喜剧" trendingType="ECAYN54KI" trendingName="热门喜剧电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub("ECAYN54KI")}
                    showSubLogs={setSubLogData}
                />
                <DoubanRanking
                    title="动画" trendingType="EC3UOBDQY" trendingName="热门动画电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub("EC3UOBDQY")}
                    showSubLogs={setSubLogData}
                />
                <DoubanRanking
                    title="动作" trendingType="ECBUOLQGY" trendingName="热门动作电影"
                    onSub={onSub}
                    onDelete={onDelete}
                    isSub={isSub('ECBUOLQGY')}
                    showSubLogs={setSubLogData}
                />
                <DoubanRanking title="爱情" trendingType="ECSAOJFTA" trendingName="热门爱情电影"
                               onSub={onSub}
                               onDelete={onDelete}
                               isSub={isSub('ECSAOJFTA')}
                               showSubLogs={setSubLogData}
                />
                <DoubanRanking title="悬疑" trendingType="ECPQOJP5Q" trendingName="热门悬疑电影"
                               onSub={onSub}
                               onDelete={onDelete}
                               isSub={isSub('ECPQOJP5Q')}
                               showSubLogs={setSubLogData}
                />
            </FilterOptionsProvider>
        </>
    )
}

export default RecentPopularMovieList