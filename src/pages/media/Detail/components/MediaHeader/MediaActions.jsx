import React from 'react';
import styled, {css} from "styled-components/macro";
import {Box, Button, Stack, Typography} from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';

const MediaActions = () => {
  return(
    <Actions>
      <Button variant="outlined" startIcon={<FileDownloadIcon />}>
        提交请求
      </Button>
    </Actions>
  );
}

const Actions = styled.div`
  position: relative;
  margin-top: 1rem;
  display: flex;
  flex-shrink: 0;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;

  @media (min-width: 1280px){
    margin-top: 0;
  }
  @media (min-width: 640px) {
    flex-wrap: nowrap;
    justify-content: flex-end;
  }
`;

export default MediaActions;