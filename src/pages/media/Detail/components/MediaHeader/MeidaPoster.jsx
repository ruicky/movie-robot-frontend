import React from 'react';
import styled, {css} from "styled-components/macro";

const MediaPoster = ({src}) => {
  return (
    <Poster>
      <SpanWrapper>
        <SpanInner />
        <ImgWrapper src={src} />
      </SpanWrapper>
    </Poster>
  );
}

const Poster = styled.div`
  width: 128px;
  overflow: hidden;
  border-radius: 4;
  --tw-shadow: 0 1px 3px 0 rgb(0 0 0/0.1),0 1px 2px -1px rgb(0 0 0/0.1);
  --tw-ring-shadow: 0 0 #0000;
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color),0 1px 2px -1px var(--tw-shadow-color);
  box-shadow: var(--tw-ring-offset-shadow,0 0 #0000),var(--tw-ring-shadow,0 0 #0000),var(--tw-shadow);
  @media (min-width: 1280px) {
    margin-right: 16px;
    width: 208px;
  }
`;

const SpanWrapper = styled.span`
    box-sizing: border-box;
    display: block;
    overflow: hidden;
    width: initial;
    height: initial;
    background: none;
    opacity: 1;
    border: 0px;
    margin: 0px;
    padding: 0px;
    position: relative;
`;

const SpanInner = styled.span`
  box-sizing: border-box;
  display: block;
  width: initial;
  height: initial;
  background: none;
  opacity: 1;
  border: 0px;
  margin: 0px;
  padding: 150% 0px 0px;
`;

const ImgWrapper = styled.img`
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
`;



export default MediaPoster;

