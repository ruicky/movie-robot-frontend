import styled from "styled-components/macro";
import {Chip as MuiChip} from "@mui/material";
import React from "react";

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;

function MetaTag({label, color}) {
    return (
        <Chip label={label} color={color}/>
    )
}

export default MetaTag