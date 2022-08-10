import React from 'react';
import { Box } from "@mui/material";
import styled, {css} from "styled-components/macro";
import { useDispatch, useSelector } from "react-redux";
import { selectSubscribeList } from "@/redux/slices/multiple-choice.slice";

const ChoiceChecked = ({id}) => {
  const subscribeList = useSelector(selectSubscribeList);
  const isCheck = subscribeList.filter(x => x == id).length > 0;
  return(
    <CheckedStyle isCheck={isCheck} />
  )
}

const checkedCss = css`
  border: 2px solid #f78228;
  background-color: rgba(0,0,0, 0.3);
`;

const CheckedStyle = styled(Box)`
  border-radius: 10px;
  width: 100%;
  height: 100%;
  min-height: 100%;
  max-height: 100%;
  ${props => props.isCheck ? checkedCss : null}
  
  position: absolute;
  top: 0px;
  right: 0px;
  bottom: 0px;
  left: 0px;
  height: 100%;
  width: 100%;
  overflow: hidden;
  
`;

export default ChoiceChecked;