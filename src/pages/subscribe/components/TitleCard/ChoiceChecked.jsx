import React from 'react';
import { Box } from "@mui/material";
import styled, {css} from "styled-components/macro";
import { useSelector } from "react-redux";
import { selectSubscribeList } from "@/redux/slices/multiple-choice.slice";

const ChoiceChecked = ({id, children}) => {
  const subscribeList = useSelector(selectSubscribeList);
  const isCheck = subscribeList.filter(x => x === id).length > 0;
  const isMultipleMode = subscribeList.length > 0;
  return(
    <CheckedStyle isMultipleMode={isMultipleMode} isCheck={isCheck}>
      {children}
    </CheckedStyle>
  )
}

const checkedCss = css`
  transform: translateZ(0) scale3d(.79,.84,1);
  border: 1px solid #f78228;
  opacity: 1 !important;
  &:before {
    filter: blur(0px) opacity(1);
    
  }
  &:after {
    bottom: 0;
    right: 0;
    content: '';
    position: absolute;
    width: 0;
    height: 0;
    border-bottom: 42px solid #f78228;
    border-left: 42px solid transparent;
  }
`;

const CheckedStyle = styled(Box)`
  width: 100%;
  height: 100%;
  ${props => props.isCheck ? checkedCss : null};
  position: absolute;
  overflow: hidden;
  transition: opacity,transform .2s ease-out;
  opacity: ${props => props.isMultipleMode ? 0.5 : 1};
  &:before {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    content: '';
  }
`;

export default ChoiceChecked;