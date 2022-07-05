import React from 'react';
import { Paper, IconButton, InputBase, Typography,Box, Divider, Stack } from '@mui/material';
import styled from "styled-components/macro";

const SearchTag = ({title, sx, list, onClick}) => {
  return(
    <Box sx={{...sx }}>
      <Typography variant="caption" display="block" color="text.disabled" gutterBottom >
        {title}
      </Typography>
      <Divider light />
      <Stack spacing={2} direction="row" sx={{mt: 2}}>
        {
          list?.map(item => (<Typography color='info.main'  sx={{cursor: 'pointer'}} onClick={() => onClick && onClick(item)}>{item.name}</Typography>))
        }
      </Stack>
    </Box>
  );
}

export default SearchTag;