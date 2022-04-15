import React from 'react'
import { Typography } from "@mui/material";
import styled from "styled-components/macro";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


const SubHeader = ({text}) => {
  return(
    <Typography  sx={{p:2}} variant="h4" gutterBottom>
      {text}
    </Typography>
  );
}

export default SubHeader;
