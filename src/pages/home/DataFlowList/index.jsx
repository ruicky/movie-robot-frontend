import React from 'react';
import ListItem from './ListItem';
import styled from "styled-components/macro";
import { Grid, Stack, Typography, Divider } from "@mui/material";


const DataFlowList = () => {
  // TODO：获取数据
  const list = [
    {
      name: '奇异博士2：疯狂多元宇宙',
      imgUrl: '/static/img/default_backdrop.jpeg',
      desc: '充满无限未知的疯狂多元宇宙即将展开，一切皆有可能。'
    }, {
      name: '侏罗纪世界3',
      imgUrl: '/static/img/default_backdrop.jpeg',
      desc: '故事的开篇设定在纳布拉尔岛被摧毁的四年后。如今，恐龙在世界各地与人类共同生活、共同捕猎'
    }
  ]
  return (
    <Grid sx= {{p: 4}}>
      <Grid item>
        <Typography variant="h3" gutterBottom>
          数据
        </Typography>
      </Grid>
      <Divider sx={{my:3 }}/>
      <Stack spacing={2}>
        {
          list.map(item => <ListItem data={item} />)
        }
      </Stack>
    </Grid>
  );
}

export default DataFlowList;