import React from 'react';
import styled from "styled-components/macro";


const MediaBgImg = ({src}) => {
  return(
      <MediaPageBgImage>
        <ImgWrap alt src={src} decoding="async" data-nimg="fill"  />
        <ImgMask />
      </MediaPageBgImage>
  )
};

export const MediaPageBgImage = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  /* height: 100%; */
  height: 493px;
  width: 100%;
`;

const ImgWrap = styled.img`
  position: absolute;
  inset: 0px;
  box-sizing: border-box;
  padding: 0px;
  border: none;
  margin: auto;
  display: block;
  width: 0px;
  height: 0px;
  min-width: 100%;
  max-width: 100%;
  min-height: 100%;
  max-height: 100%;
  object-fit: cover;
`;

const ImgMask = styled.div`
  background-image: linear-gradient(rgba(17, 24, 39, 0.47) 0%, rgb(17, 24, 39) 100%);
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  position: absolute;
`;


export default MediaBgImg;