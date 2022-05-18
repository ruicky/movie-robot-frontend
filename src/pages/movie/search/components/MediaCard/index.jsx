import React from 'react';
import styled from "styled-components/macro";
import {Box, Chip as MuiChip, Grid, Link, Stack, Typography, Button, Card, CardContent, CardMedia, IconButton} from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const MediaCard = () => {
  return(
    <Card sx={{ display: 'flex' }}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image="https://www.themoviedb.org/t/p/w600_and_h900_bestv2/kj5SQ0PzfnDHkyu2ZbfGTFvndvN.jpg"
        alt="Live from space album cover"
      />
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            间谍过家家
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
            2022 · 动画 · 日本 · 共 12 集
          </Typography>
          <Typography gutterBottom color="textSecondary" component="p">
            为了潜入名校，西国能力最强的间谍’黄昏‘被下令组建家庭.但是，他的“女儿”居然是能够读取他人内心的超能力者！“妻子”是暗杀者？互相隐藏了真实身份的新家庭，面临考验与世界危机的痛快家庭喜剧就此展开！！
            </Typography>
        </CardContent>
        <CardContent>
          <Button variant="outlined" startIcon={<PlayArrowIcon />}>
            播放
          </Button>
        </CardContent>
      </Box>
      
    </Card>
  );
}

export default MediaCard;