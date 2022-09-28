import React from 'react';
import styled, {css} from "styled-components/macro";
import {Box, Button, Stack, Typography} from "@mui/material";
import MediaBgImg from './components/MediaBgImg';
import MediaHeader from './components/MediaHeader';
import MediaOverview from './components/MediaOverview';



const Detail = () => {
  return(
    <MediaPage>
      <MediaBgImg src={'https://image.tmdb.org/t/p/w1920_and_h800_multi_faces//Aa9TLpNpBMyRkD8sPJ7ACKLjt0l.jpg'} />
      <MediaHeader />
      <MediaOverview />
    </MediaPage>
  )
}

const MediaPage = styled.div`
  padding: 0 10px;
  width: 100%;
  /* height: 493px; */
  position: relative;
  /* margin-left: -16px;
  margin-right: -16px; */
  background-size: cover;
  background-position: 50%;
  /* padding-left: 16px;
  padding-right: 16px; */
  margin-top: calc(-64px - env(safe-area-inset-top));
  padding-top: calc(64px + env(safe-area-inset-top));
`;


export default Detail;
