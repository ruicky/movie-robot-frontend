import React from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import DoubanRanking from "@/pages/recommend/components/DoubanRanking";
import {FilterOptionsProvider} from "@/contexts/FilterOptionsProvider";


const NetflixList = () => {
    return (
        <>
            <Helmet title="Netflix独家"/>
            <PageTitle text="Netflix独家"/>
            <FilterOptionsProvider>
                <DoubanRanking title="热门影片" trendingType="NFPopularonNetflix" trendingName="热门影片"/>
                <DoubanRanking title="新片上映" trendingType="NFNewReleases" trendingName="新片上映"/>
                <DoubanRanking title="西方电影" trendingType="NFWesternMovies" trendingName="欧美电影"/>
                <DoubanRanking title="西方剧集" trendingType="NFWesternTVShows" trendingName="欧美剧集"/>
                <DoubanRanking title="美剧" trendingType="NFUSTVShows" trendingName="美剧"/>
                <DoubanRanking title="韩剧" trendingType="NFK-Dramas" trendingName="韩剧"/>
                <DoubanRanking title="纪录片" trendingType="NFDocumentaries" trendingName="纪录片"/>
                <DoubanRanking title="过去一年推出的影片" trendingType="NFReleasedinthePastYear" trendingName="过去一年推出的影片"/>
            </FilterOptionsProvider>
        </>
    )
}

export default NetflixList