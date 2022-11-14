import React from "react";
import styled from "styled-components/macro";
import { CircularProgress } from "@mui/material";

const Root = styled.div`
  justify-content: center;
  align-items: center;
  display: flex;
  height: 100%;
  min-height: 80vh;
`;

function Loader() {
  return (
    <Root>
      <CircularProgress color="secondary" />
    </Root>
  );
}

export default Loader;
