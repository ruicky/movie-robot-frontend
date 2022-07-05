import React from 'react';
import { Paper, IconButton, InputBase, Typography,Box, Chip } from '@mui/material';
import styled from "styled-components/macro";
import SearchIcon from '@mui/icons-material/Search';
import TagFacesIcon from '@mui/icons-material/TagFaces';

const TopSearch = ({onClose, site}) => {
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
          placeholder={site ? `在${site.name}中搜索` : "搜索"}
          inputProps={{ 'aria-label': '搜索' }}
        />
      </SearchInputWrap>
      <Typography variant="button" display="block" sx={{cursor: 'pointer', ml: 2}} color='info.main' onClick={onClose}>
        取消
      </Typography>
    </PaperWrap>
  );
}

const PaperWrap = styled(Paper)`
 
`;

const SearchInputWrap = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  border-radius: 10px;
`;

export default TopSearch;