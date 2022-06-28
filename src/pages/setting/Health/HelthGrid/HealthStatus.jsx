import React from 'react';
import styled from "styled-components/macro";
import {Tooltip, Badge, Grid, Typography} from "@mui/material";

const HealthStatus = ({title, status}) => {
  let color = '';
  switch (status) {
    case 'success':
      color = '#5cdd8b';
      break;
    case 'error':
      color = '#dc3545';
      break;
    case 'pending':
      color = '#f8a306';
      break;
    default:
      color = '#f0f8ff';
      break;
  }
  return(
    <Tooltip title={title || ''} placement="top">
      <StatusBar backgroundColor = {color} />
    </Tooltip>
  )
} 

const StatusBar = styled.div`
  ${(props) => props.theme.breakpoints.up("md")} {
    width: 10px;
    height: 30px
  }
  background-color: ${(props) => props.backgroundColor};
  width: 5px;
  height: 16px;
  display: inline-block;
  border-radius: 50rem;
  white-space: nowrap;
  &:hover {
    transition: all ease-in-out 0.15s;
    opacity: 0.8;
    transform: scale(var(--hover-scale));
  }
`;

export default HealthStatus;