import React from 'react'
import { Typography } from "@mui/material";
import styled from "styled-components/macro";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';


const SubHeader = ({text}) => {
  return(
    <Typography  sx={{p:2}} variant="h2" gutterBottom>
      <Span>{text}</Span>
    </Typography>
  );
}

export default SubHeader;

const Span = styled.span`
  --tw-gradient-from: #818cf8;
  --tw-gradient-to: #c084fc;
  --tw-gradient-stops: var(--tw-gradient-from), var(--tw-gradient-to, rgb(129 140 248/0));
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
`;
