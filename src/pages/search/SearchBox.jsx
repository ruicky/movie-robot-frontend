import React, {useEffect, useState} from 'react';
import styled from "styled-components/macro";
import {Button, Card, CardContent, IconButton, InputAdornment, InputBase, Paper, Typography} from "@mui/material";
import {Search as SearchIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";


const SearchBox = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState();
  const [isFoucs, setIsFoucs] = useState(false);
  const onSearch = (keyword) => {
    navigate("/movie/search?keyword=" + keyword)
  }

  return (
    <Inputwrapper isFoucs={isFoucs || value}>
      <Input
          isFoucs={isFoucs || value}
          id="input-with-icon-adornment"
          placeholder="搜索喜欢的一切"
          onChange={({target: {value: v}}) => {
              setValue(v);
          }}
          onKeyUp={(e) => {
              if ((e.key === 'Enter' || e.key === "NumpadEnter") && value) {
                  onSearch(value);
              }
          }}
          onFocus={() => setIsFoucs(true)}
          onBlur={() => setIsFoucs(false)}
          value={value}
          fullwidth
          startAdornment={
              <InputAdornment sx={{minWidth: '28px', height: '45%'}}>
                  <IconButton type="submit" aria-label="search" onClick={() => {
                      if (value) {
                          onSearch(value);
                      }
                  }}>
                      <SearchIconWrapper />
                  </IconButton>
              </InputAdornment>
          }
      />
  </Inputwrapper>
  )
}

const Inputwrapper = styled.div`
    transition: all .1s;
    width: 100%;
    display: block;
    /* opacity: ${(props) => props.isFoucs ? 0.8 : 0.5};
    ${(props) => props.theme.breakpoints.up("md")} {
      width: 78%;
      min-height: 40px;
      max-height: 52px;
      height: 100%;
      min-width: 580px;
      max-width: 596px;
      top: 15%;
    } */
`;

const Input = styled(InputBase)`
  width: 100%;
  color: inherit;
  ${(props) => props.theme.breakpoints.up("md")} {
    background: ${(props) => props.theme.header.search.background};
  }
  background: rgba(255, 255, 255, 0.19);
  border-radius: 24px;
  opacity: 5;
  > input {
    color: ${(props) => props.theme.header.search.color};
    padding-top: ${(props) => props.theme.spacing(2.5)};
    padding-right: ${(props) => props.theme.spacing(2.5)};
    padding-bottom: ${(props) => props.theme.spacing(2.5)};
  }
  > input::-webkit-input-placeholder {
    ${(props) => props.theme.breakpoints.up("md")} {
      color: ${(props) => props.theme.header.search.color};
    }
    color: rgba(255, 255, 255, 1)
  }
  > input:-moz-placeholder {
    ${(props) => props.theme.breakpoints.up("md")} {
      color: ${(props) => props.theme.header.search.color};
    }
    color: rgba(255, 255, 255, 1)
  }
  > input:-ms-input-placeholder {
    ${(props) => props.theme.breakpoints.up("md")} {
      color: ${(props) => props.theme.header.search.color};
    }
    color: rgba(255, 255, 255, 1)
  }
`;

const SearchIconWrapper = styled(SearchIcon)`
  ${(props) => props.theme.breakpoints.up("md")} {
    color: ${(props) => props.theme.header.search.color};
  }
  color: #fff;
`;

export default SearchBox;