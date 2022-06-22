import React from 'react';
import styled from "styled-components/macro";
import { Card, CardContent, CardMedia, Box, Typography, IconButton, Divider } from "@mui/material";
import {Info as InfoIcon} from '@mui/icons-material';
import LinesEllipsis from 'react-lines-ellipsis'

const ListItem = ({data}) => {
  const {name, imgUrl, desc} = data;
  return(
    <Box>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <Typography variant="h5" gutterBottom component="div">
          6月24号
        </Typography>
        <IconButton aria-label="play">
          <InfoIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          // bgcolor: 'background.paper',
          overflow: 'hidden',
          // borderRadius: '12px',
          boxShadow: 1,
          display: 'flex',
        }}
      >
        <Box
          component="img"
          sx={{
            height: 150,
            width: 100,
            maxHeight: { xs: 150, md: 200 },
            maxWidth: { xs: 100, md: 250 },
          }}
          alt={name}
          src={imgUrl}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            // justifyContent: 'center',
            pt: 2,
            ml: 2,
            minWidth: { md: 350 },
          }}
        >
          <Typography variant="h6" gutterBottom component="div">
            {name}(2022)
          </Typography>
          <Typography variant="subtitle2" gutterBottom component="div" color="textSecondary">
            演员：xxx
          </Typography>
          <Typography variant="subtitle2" gutterBottom component="div" color="textSecondary">
            评分：xxx
          </Typography>
        </Box>
      </Box>
      <Box sx={{my: 2, p: 2, bgcolor: 'background.paper', borderRadius: '12px'}}>
        <Typography variant="subtitle2" gutterBottom component="div" color="textSecondary">
          <LinesEllipsis text={desc} maxLine={3} style={{minHeight: '40px'}}/>
        </Typography>
      </Box>
      <Divider sx={{my: 4}} />
    </Box>
  );
}

export default ListItem;