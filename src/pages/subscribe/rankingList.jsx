import React from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import SearchIcon from '@mui/icons-material/Search';
import {Link} from "react-router-dom";
import {IconButton,} from "@mui/material";
import DoubanRanking from "@/pages/subscribe/components/DoubanRanking";


const RankingList = () => {
    return (
        <>
            <Helmet title="影片推荐"/>
            <PageTitle text="影片推荐"/>
            <DoubanRanking title="实时热门电影" rankType="movie_real_time_hotest"/>
            <DoubanRanking title="一周口碑电影榜" rankType="movie_weekly_best"/>
            <DoubanRanking title="全球口碑剧集榜" rankType="tv_global_best_weekly"/>
            <DoubanRanking title="华语口碑剧集榜" rankType="tv_chinese_best_weekly"/>
        </>
    )
}

export default RankingList