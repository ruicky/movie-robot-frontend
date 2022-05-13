import React, {useEffect, useState} from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import DoubanRanking from "@/pages/subscribe/components/DoubanRanking";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";


const RecentPopularTVList = () => {
    return (
        <>
            <Helmet title="全球热播剧集"/>
            <PageTitle text="全球热播剧集"/>
            <FilterOptionsProvider>
                <DoubanRanking title="美剧" rankType="ECFA5DI7Q"/>
                <DoubanRanking title="大陆剧" rankType="EC74443FY"/>
                <DoubanRanking title="日剧" rankType="ECNA46YBA"/>
                <DoubanRanking title="韩剧" rankType="ECBE5CBEI"/>
            </FilterOptionsProvider>
        </>
    )
}

export default RecentPopularTVList