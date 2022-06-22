import React from 'react';
import styled from "styled-components/macro";
import { Paper } from "@mui/material";
import  DailyRecommend from './DailyRecommend';
import DataFlowList from './DataFlowList/index';

const HomePage = () => {
  return (
    <div>
      <DailyRecommend />
      <DataFlowList/>
    </div>
  )
}

export default HomePage;