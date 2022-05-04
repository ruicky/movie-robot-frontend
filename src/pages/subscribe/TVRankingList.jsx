import React from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import DoubanRanking from "@/pages/subscribe/components/DoubanRanking";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";


const TVRankingList = () => {
    return (
        <>
            <Helmet title="电视榜单"/>
            <PageTitle text="电视榜单"/>
            <FilterOptionsProvider>
                <DoubanRanking title="华语热播剧集" rankType="tv_chinese_best_weekly"/>
                <DoubanRanking title="全球热播剧集" rankType="tv_global_best_weekly"/>
                <DoubanRanking title="国内热播综艺" rankType="show_chinese_best_weekly"/>
                <DoubanRanking title="国外热播综艺" rankType="show_global_best_weekly"/>
            </FilterOptionsProvider>
        </>
    )
}

export default TVRankingList