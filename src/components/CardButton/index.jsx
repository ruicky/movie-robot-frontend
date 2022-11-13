import styled, { css, keyframes } from "styled-components/macro";
import React, { useEffect, useRef } from "react";
import StopCircleIcon from '@mui/icons-material/StopCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import { Box, Box as MuiBox, CircularProgress, Typography } from "@mui/material";
import _ from "lodash";
import * as m_icon from "@mui/icons-material";
import * as f_icon from "react-feather";

const breatheAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(0.98); }
  100% { transform: scale(1); }
`

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
  transition: all 0.2s ease;
  &:hover {
    transform: scale(1.02);
  }
  &.isAnimation { 
    animation: ${breatheAnimation} 0.3s ease-in-out alternate;
  }
  ${(props) => props.selected && cardSelectStyle}
`;

const CardHead = styled(MuiBox)({
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: 20
});

const CardStatus = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    height: 32px;
    width: 32px;
`;

const RunningButton = () => {
    return <Box sx={{ m: 1, position: 'relative', margin: 0 }}>
        <StopCircleIcon fontSize="large" />
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

export const CardButton = ({ color, icon, label, helper, selected, status, onClick }) => {
    const Icon = _.get({
        ...m_icon,
        ...f_icon
    }, icon, null);

    // 点击动画
    const [isAnimation, setIsAnimation] = React.useState(false);
    const card = useRef(null)
    // 触发动画
    const handleAnimation = () => {
        setIsAnimation(true);
        // 震动
        if (navigator.vibrate) {
            navigator.vibrate(100);
        }
        card.current.addEventListener('animationend', () => {
            setIsAnimation(false);
        })
    }

    const handleClick = (event) => {
        handleAnimation()
        onClick && onClick(event);
    }

    //  运行完成
    useEffect(() => {
        if (status === 'done') {
            handleAnimation()
        }
    }, [status]);

    return <Card
        color={color}
        selected={selected}
        onClick={handleClick}
        className={isAnimation && 'isAnimation'}
        ref={card}
    >
        <CardHead>
            {Icon && <Icon fontSize="large" />}
            <CardStatus>
                {status === 'running' && <RunningButton fontSize="large" />}
                {status === 'done' && <CheckCircleIcon fontSize="large" />}
                {status === 'error' && <ErrorIcon fontSize="large" />}
                {(status === undefined || status === null || status === 'ready') && <PlayCircleIcon fontSize="large" />}
            </CardStatus>
        </CardHead>
        <Typography variant="h6" color="#FFF" gutterBottom>
            {label}
        </Typography>
        <Typography variant="caption" color="#FFF" display="block" gutterBottom>
            {helper}
        </Typography>
    </Card>
}