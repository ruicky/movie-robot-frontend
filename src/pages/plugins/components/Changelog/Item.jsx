import React from "react";
import {Chip as MuiChip, Typography} from "@mui/material";
import styled from "styled-components/macro";
const Chip = styled(MuiChip)`
  height: 20px;
  margin-top: -3px;
  font-weight: bold;
  font-size: 75%;
  background-color: rgb(71, 130, 218)
`;
export const ChangeLogItem = ({version,publishDate,body}) => {
    return (<Typography variant="subtitle1">
        <Chip color="secondary" label={`v${version}`}/> – {publishDate}
        <ul>
            {body && body.split('\n').map((val,index) => <li key={index}>{val}</li>)}
        </ul>
    </Typography>);
}