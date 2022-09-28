import React from 'react';
import styled, {css} from "styled-components/macro";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import MediaPoster from './MeidaPoster';
import MediaTitle from './MediaTitle';
import MediaActions from './MediaActions';

const MediaHeader = () => {
  const theme = useTheme();
  const isLgMd = useMediaQuery(theme.breakpoints.up("md"));

  return (
    <Header pl={isLgMd ? 14 : 0}>
      <MediaPoster src={'https://image.tmdb.org/t/p/w600_and_h900_bestv2/z2yahl2uefxDCl0nogcRBstwruJ.jpg'} />
      <MediaTitle />
      <MediaActions />
    </Header>
  );
};

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 16px;
  
  @media (min-width: 1280px) {
    flex-direction: row;
    align-items: flex-end;
  }
`;

export default MediaHeader;
