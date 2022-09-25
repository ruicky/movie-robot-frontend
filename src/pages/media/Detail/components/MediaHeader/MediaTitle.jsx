import React from 'react';
import styled, {css} from "styled-components/macro";
import {Stack, Divider} from '@mui/material';

const MediaTitle = () => {
  return (
    <Title>
      <h1>
        龙之家族
        <span style={{fontSize: '18px', lineHeight: '32px'}}>
          (2022)
        </span>
      </h1>
      <MediaAttributes>
        
      </MediaAttributes>
      <Stack
        direction="row"
        divider={<Divider orientation="vertical" flexItem color="white" />}
        spacing={2}
      >
        <span>1 季</span>
        <span>Sci-Fi & Fantasy、剧情、动作冒险</span>
      </Stack>

    </Title>
  );
};

const Title = styled.div`
  z-index: 10;
  display: flex;
  flex: 0.9 1 0%;
  flex-direction: column;
  text-align: center;
  color: rgb(255 255 255);
  @media (min-width: 1280px)  {
    margin-right: 16px;
    margin-top: 0;
    text-align: left;
  }

`;

const MediaAttributes = styled.span`
  color: rgb(209 213 219);
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  @media (min-width: 1280px) {
    margin-top: 0;
    justify-content: flex-start;
    font-size: 16px;
    line-height: 24px;
  }
  @media (min-width: 640px) {
    font-size: 14px;
    line-height: 20px;
  }
`;

export default MediaTitle;