import React from 'react';
import styled from "styled-components/macro";
import {Button, Box} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SearchDialog from '@/components/SearchDialog'

const SearchBox = () => {
  return (
    <SearchWrapper variant="outlined" startIcon={<SearchIcon />}>
      {/* <ShortCutWrapper sx={{borderRadius: '5px', py:2}}>⌘K</ShortCutWrapper> */}
      <SearchText sx={{ml:2, mr: 'auto'}}>搜索...</SearchText>
      <SearchDialog />
    </SearchWrapper>
  );
}

const SearchWrapper = styled(Button)`
  min-height: 34px;
  height: 34px;
  display: flex;
  align-items: center;
  min-width: 120px;
  padding-left: 12px;
  position: relative;
  font-size: 14px;
  cursor: pointer;
  justify-content: flex-start;
  ${(props) => props.theme.breakpoints.down("sm")} {
    background-color: transparent;
    min-width: 34px;
    padding-right: 0px;
    padding-left: 18px;
    justify-content: center;
  }
`

const ShortCutWrapper = styled(Box)`
  border-radius: 5px;
  font-size: 12px !important;
  font-weight: 700;
  line-height: 20px;
  margin-left: 4px;
  color: ${(props) => props.theme.header.color};
  border: 1px solid ${(props) => props.theme.palette.primary.main};
  background-color: ${(props) => props.theme.palette.primary.info};
  padding: 0px 6.4px;
  ${(props) => props.theme.breakpoints.down("sm")} {
    display: none;
  }
`;
const SearchText = styled(Box)`
  color: ${(props) => props.theme.header.color};
  ${(props) => props.theme.breakpoints.down("sm")} {
    display: none;
  }
`;

export default SearchBox;