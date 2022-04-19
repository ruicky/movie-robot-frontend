import React, {useEffect, useRef} from 'react';
import SearchInput from '../SearchInput';
import ListView from '../ListView';
import SubHeader from '../SubHeader';
import { useSubscribeSearch } from '@/utils/subscribe';
import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import {Link} from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import {useSubscribeSearchParams} from '../../util';
import useDebounce from '@/hooks/useDebounce';


const Search = () => {
  const [param, setParam] = useSubscribeSearchParams();
  const { data, isLoading: searchIsLoading, isSuccess } = useSubscribeSearch(useDebounce(param, 1000));

  let searchList
  if (isSuccess) {
    searchList = data?.data?.map(x=>({...x, cn_name: x.name, status: 2}));
  }

  return(
    <>
      <Helmet title="订阅"/>
      <PageTitle text="搜索订阅">
        <IconButton color="info" aria-label="搜索订阅" size="large" component={Link} to={"/subscribe/list"}>
            <ArrowBackIcon/>
        </IconButton>
      </PageTitle>
      <SearchInput style={{ margin: '10px 0' }} param={param} setParam={setParam}/>
      {
        param?.keyword && <>
          <SubHeader text='搜索结果' />
          <ListView
            items={searchList}
            isLoading={searchIsLoading}
          />
        </>
      }
    </>
  );

};

export default Search;
