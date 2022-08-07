import React from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import DoubanRanking from "@/pages/recommend/components/DoubanRanking";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";


const TvRankingList = () => {
    return (
        <>
            <Helmet title="剧集榜单"/>
            <PageTitle text="近期热门剧集"/>
            <FilterOptionsProvider>
                <DoubanRanking title="国产剧" rankType="tv_domestic"/>
                <DoubanRanking title="美剧" rankType="tv_american"/>
                <DoubanRanking title="日剧" rankType="tv_japanese"/>
                <DoubanRanking title="韩剧" rankType="tv_korean"/>
                <DoubanRanking title="动漫" rankType="tv_animation"/>
            </FilterOptionsProvider>
        </>
    )
}

export default TvRankingList