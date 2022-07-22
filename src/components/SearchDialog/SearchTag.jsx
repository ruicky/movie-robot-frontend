import React from 'react';
import { Paper, IconButton, InputBase, Typography,Box, Divider, Stack, Checkbox, FormGroup, FormControlLabel, Chip, Avatar, FormControl } from '@mui/material';
import styled from "styled-components/macro";
import DoneIcon from '@mui/icons-material/Done';

const SearchTag = ({title, sx, list, onClick, checkData}) => {
  return(
    <Box sx={{...sx }}>
      <Typography variant="caption" display="block" color="text.disabled" gutterBottom >
        {title}
      </Typography>
      <Divider light />
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <FormGroup row>
          {
            list?.map(item => (
              <FormControlLabel
                control={
                  <Checkbox defaultChecked checked={checkData && checkData[item.value]} onChange={(e) => onClick(e.target.name, e.target.checked)} name={item.value} />
                }
                label={item.name}
              />
            ))
          }
        </FormGroup>
      </FormControl>
    </Box>
  );
}

export default SearchTag;