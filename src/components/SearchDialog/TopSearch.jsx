import React from 'react';
import { Paper, IconButton, InputBase, Typography,Box, Chip, Autocomplete, TextField } from '@mui/material';
import styled from "styled-components/macro";
import SearchIcon from '@mui/icons-material/Search';
import TagFacesIcon from '@mui/icons-material/TagFaces';

const TopSearch = ({onClose, site, category}) => {
  let placeholder = '';
  if (site) {
    placeholder += `在${site.name}中搜索`;
  } else {
    placeholder = '搜索'
  }
  if (category) {
    placeholder += `${category.name}`;
  }
  // TODO: 跳转到搜索页携带参数

  return (
    <PaperWrap
      component="form"
      sx={{ p: '2px 4px', display: 'flex', alignItems: 'center' }}
    >
      <SearchInputWrap sx={{flex: 1}}>
        <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={placeholder}
          inputProps={{ 'aria-label': '搜索' }}
        />
      </SearchInputWrap>
      <Typography variant="button" display="block" sx={{cursor: 'pointer', ml: 2}} color='info.main' onClick={onClose}>
        取消
      </Typography>
    </PaperWrap>
  );
}

const PaperWrap = styled(Paper)``;

const SearchInputWrap = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  border-radius: 10px;
`;

export default TopSearch;