import React, {useEffect, useState} from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";
import DoubanRanking from "@/pages/recommend/components/DoubanRanking";


const MovieRankingList = () => {
    return (
        <>
            <Helmet title="电影榜单"/>
            <PageTitle text="电影榜单"/>
            <FilterOptionsProvider>
                <DoubanRanking title="实时热门电影" rankType="movie_real_time_hotest"/>
                <DoubanRanking title="近期热门电影" rankType="ECPE465QY"/>
                <DoubanRanking title="一周高分电影" rankType="movie_weekly_best"/>
                <DoubanRanking title="近期高分电影" rankType="EC7Q5H2QI"/>
            </FilterOptionsProvider>
        </>
    )
}

export default MovieRankingList