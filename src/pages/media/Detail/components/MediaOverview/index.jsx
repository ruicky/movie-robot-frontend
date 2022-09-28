import React from 'react';
import styled, {css} from "styled-components/macro";
import {Grid, Box, List, ListItem, Divider, ListItemText, Typography} from "@mui/material";

const MediaOverview = () => {
  return(
    <OverView>
      <LeftView>
        <h2>简介</h2>
        <p>本剧改编自乔治·马丁的《血与火》，背景为《权力的游戏》涉及事件的200年前，聚焦坦格利安家族。故事将讲述坦格利安家族的衰落，以及被称之为“血龙狂舞”的家族内战。</p>
        <Grid  container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {Array.from(Array(6)).map((_, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Box>
                <span>Creator</span>
                <Typography variant="subtitle1" color="text.disabled">George R. R. Martin</Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </LeftView>
      <RightView>
        <List sx={{width: '100%', border: '1px solid rgb(55 65 81)', borderRadius: '8px'}}>
          <ListItem divider>
            <ListItemText primary="原始標題" />
            <Typography variant="subtitle1" color="text.disabled">House of the Dragon</Typography>
          </ListItem>
          <ListItem divider>
            <ListItemText primary="状态" />
            <Typography variant="subtitle1" color="text.disabled">Returning Series</Typography>
          </ListItem>
          <ListItem divider>
            <ListItemText primary="原始播出日期" />
            <Typography variant="subtitle1" color="text.disabled">2022年8月21日</Typography>
          </ListItem>
          <ListItem divider>
            <ListItemText primary="下一次播出日期" />
            <Typography variant="subtitle1" color="text.disabled">2022年9月25日</Typography>
          </ListItem>
          <ListItem>
            <ListItemText primary="原始语言" />
            <Typography variant="subtitle1" color="text.disabled">英语</Typography>
          </ListItem>
        </List>
        {/* <GridTable container>
            <GridCell item>
              <span>原始標題</span>
              <span>House of the Dragon</span>
            </GridCell>
            <GridCell item>
              <span>状态</span>
              <span>Returning Series</span>
            </GridCell>
        </GridTable> */}
      </RightView>
    </OverView>

  );
};

const OverView =  styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 32px;
  padding-bottom: 16px;
  --tw-text-opacity: 1;
  color: rgb(255 255 255/var(--tw-text-opacity));
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const LeftView = styled.div`
  z-index: 10;
  flex: 1 1 0%;
  @media (min-width: 1024px)  {
    margin-right: 32px;
  }
`;

const RightView = styled.div`
  z-index: 10;
  margin-top: 16px;
  width: 100%;
  @media (min-width: 1024px) {
    margin-top: 0;
    width: 320px; 
  }
`;

export default MediaOverview;