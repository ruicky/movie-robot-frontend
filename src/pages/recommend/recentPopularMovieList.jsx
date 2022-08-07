import React, {useEffect, useState} from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import DoubanRanking from "@/pages/recommend/components/DoubanRanking";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";


const RecentPopularMovieList = () => {
    return (
        <>
            <Helmet title="分类热播电影"/>
            <PageTitle text="分类热播电影"/>
            <FilterOptionsProvider>
                <DoubanRanking title="科幻" rankType="ECZYOJPLI"/>
                <DoubanRanking title="喜剧" rankType="ECAYN54KI"/>
                <DoubanRanking title="动画" rankType="EC3UOBDQY"/>
                <DoubanRanking title="动作" rankType="ECBUOLQGY"/>
                <DoubanRanking title="爱情" rankType="ECSAOJFTA"/>
                <DoubanRanking title="悬疑" rankType="ECPQOJP5Q"/>
            </FilterOptionsProvider>
        </>
    )
}

export default RecentPopularMovieList