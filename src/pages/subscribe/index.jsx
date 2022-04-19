import React from 'react';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import RecentlyAdded from './components/RecentlyAdded';
import SearchIcon from '@mui/icons-material/Search';
import {Link} from "react-router-dom";
import {
  IconButton,
} from "@mui/material";


const Subscribe = ()=> {
  return(
    <>
      <Helmet title="订阅"/>
      <PageTitle text="订阅">
        <IconButton color="info" aria-label="搜索订阅" size="large" component={Link} to={"/subscribe/search"}>
            <SearchIcon/>
        </IconButton>
      </PageTitle>
      <RecentlyAdded />
      {/* 这里可添加豆瓣热门参考 RecentlyAdded */}
    </>
  )
}

export default Subscribe