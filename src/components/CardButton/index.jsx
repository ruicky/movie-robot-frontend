import styled, {css} from "styled-components/macro";
import React from "react";
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import {Box, Box as MuiBox, CircularProgress, Typography} from "@mui/material";
import _ from "lodash";
import * as m_icon from "@mui/icons-material";
import * as f_icon from "react-feather";

const cardSelectStyle = css`
  border-style:solid;
  border-width:3px;
  border-color: #007AFF;
`
const Card = styled.div`
  // min-width: 250px;
  background: ${(props) => props.color};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 15px;
  border-radius: 20px;
  mask-image: paint(squircle);
  cursor: pointer;
  -webkit-mask-image: paint(squircle);
  --squircle-radius: 20px;
  --squircle-smooth: 0.8;
  ${(props) => props.selected && cardSelectStyle}
`;
const CardHead = styled(MuiBox)({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
});
const RunningButton = () => {
    return <Box sx={{m: 1, position: 'relative'}}>
        <StopCircleIcon fontSize="large"/>
        <CircularProgress
            size={32}
            sx={{
                color: '#4F6ED3',
                position: 'absolute',
                left: 0
            }}
        />
    </Box>
}
export const CardButton = ({color, icon, label, helper, selected, status, onClick}) => {
    const Icon = _.get({
        ...m_icon,
        ...f_icon
    }, icon, null);
    return <Card color={color} selected={selected} onClick={onClick}>
        <CardHead>
            {Icon && <Icon fontSize="large"/>}
            {status === 'running' && <RunningButton fontSize="large"/>}
            {status === 'done' && <CheckCircleIcon fontSize="large"/>}
            {status === 'error' && <ErrorIcon fontSize="large"/>}
            {(status === undefined || status === null || status === 'ready') && <PlayCircleIcon fontSize="large"/>}
        </CardHead>
        <Typography variant="h6" color="#FFF" gutterBottom>
            {label}
        </Typography>
        <Typography variant="caption" color="#FFF" display="block" gutterBottom>
            {helper}
        </Typography>
    </Card>
}