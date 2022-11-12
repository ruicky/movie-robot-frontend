import styled, {css} from "styled-components/macro";
import React from "react";
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {Box as MuiBox, Typography} from "@mui/material";
import _ from "lodash";
import * as m_icon from "@mui/icons-material";
import * as f_icon from "react-feather";

const cardSelectStyle = css`
  border-style:solid;
  border-width:3px;
  border-color: #007AFF;
`
const Card = styled.div`
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
export const CardButton = ({color, icon, label, helper, selected, onClick}) => {
    const Icon = _.get({
        ...m_icon,
        ...f_icon
    }, icon, null);
    return <Card color={color} selected={selected} onClick={onClick}>
        <CardHead>
            {Icon&&<Icon fontSize="large"/>}
            <AddCircleIcon fontSize="large"/>
        </CardHead>
        <Typography variant="h6" color="#FFF" gutterBottom>
            {label}
        </Typography>
        <Typography variant="caption" color="#FFF" display="block" gutterBottom>
            {helper}
        </Typography>
    </Card>
}