import React from 'react';
import styled from "styled-components/macro";
import { Paper, Divider, Stack, Grid, Typography } from "@mui/material";
import { getToday } from '@/utils/date';

const DailyRecommend = (data) => {
  const {
    background="https://images.fanart.tv/fanart/the-kings-of-summer-58ff9fdc8609a.jpg",
    title="《夏日之王》",
    desc=`“孩子，你绝不应该放弃一个朋友。”`
  } = data;
  const date = getToday();
  const {week, month, day, lunar_date} = date;
  return (
    <PageWrapper  background={background} sx={{mx: 2}}>
      <Grid container spacing={2} alignItems="flex-end" flexWrap="nowrap" sx={{ position: 'absolute', bottom: '10px', px: 2 }}>
        <Grid item spacing={2} sx={{minWidth: '90px'}}>
          <Typography variant="h1" component="div" sx={{fontSize: '3rem', fontWeight: '200'}}>
            {day}
          </Typography>
          <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={1.5}>
            <span>{month}</span>
            <span>{week}</span>
          </Stack>
          <Typography  component="div">
            {lunar_date}
          </Typography>
        </Grid>
        <Grid item xs={12} sm container direction="column" sx={{ml: 3}}>
          <Grid item>
            <Typography variant="h4" component="div" gutterBottom>
              {title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="subtitle1" component="div" gutterBottom>
              {desc}
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </PageWrapper>
  );
}

const PageWrapper = styled(Paper)`
  position: relative;
  border-radius: 30px;
  &::before {
    content: ' ';
    display: block;
    background-image: ${(props) => "url(" + props.background + ")"};
    opacity: 0.8;
    background-position: 50% 20% ;
    background-size: cover;
    width: 100%;
    height: 200px;
    color: #fff;
    border-radius: 30px;
  }
`;


export default DailyRecommend;