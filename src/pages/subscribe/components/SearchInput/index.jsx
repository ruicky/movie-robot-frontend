import React, {useState, useEffect} from 'react';
import { Box } from "@mui/material";
import styled from "styled-components/macro";
import {
  Search as SearchIcon,
  HighlightOff as HighlightOffIcon,
} from '@mui/icons-material';


const SearchInput = ({param, setParam,}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  const clear = () => {
    setParam({...param, keyword: ''})
  }
  useEffect(() => {
    const updateScrolled = () => {
      if (window.pageYOffset > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', updateScrolled, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrolled);
    };
  }, []);

  return(
    <Box
      sx={{
        display: 'flex',
        flex: '1 1 0%',
        margin: '10px auto',
        position: 'relative',
        flexShrink: 0,
        backgroundColor: isScrolled ? '#374151' : 'transparent',
        backdropFilter: isScrolled ? 'blur(5px)' : undefined,
        WebkitBackdropFilter: isScrolled ? 'blur(5px)' : undefined,
      }}
      className="transition duration-300"
    >
      <Box
        sx ={{
          display: 'flex',
          width: '100%',
        }}
      >
        <Label htmlFor="search_field">Search</Label>
        <InputWrapper>
          <SearchIconWrapper>
            <SearchIcon  width='20px' height='20px'/>
          </SearchIconWrapper>
          <Input
            id="search_field"
            placeholder='搜索电影电视节目'
            type="search"
            autoComplete="off"
            value={param?.keyword}
            onChange={(e) => setParam({...param, keyword: e.target.value})}
            onKeyUp={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                (e.target).blur();
              }
            }}
          />
          {param?.keyword?.length > 0 && (
            <CloseButton
              className="transition"
              onClick={() => clear()}
            >
              <HighlightOffIcon  style={{ width: '20px', height: '20px' }} />
            </CloseButton>
          )}
        </InputWrapper>

      </Box>

    </Box>
  );

}

export default SearchInput;

const Label = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  width: 100%;
  align-items: center;
  color: #fff;
  &:focus {
    color: #E5E7EB
  }
`;

const SearchIconWrapper = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0px;
  bottom: 0px;
  left: 16px;
  display: flex;
  align-items: center;
`;

const Input = styled.input`
  display: block;
  width: 100%;
  border-radius: 9999px;
  border: 1px solid rgb(75, 85, 99);
  background-color: rgba(17, 24, 39, 0.8);
  opacity: 0.8;
  padding: 8px 0 8px 40px;
  color: white;
  height: 42px;
  line-height: 42px;
  &::placeholder {
    color: #D1D5DB;
  }
  &:hover {
    border-color: #6B7280;
  }
  &:focus {
    border-color: #6B7280;
    opacity: 1;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
  &:focus::placeholder {
    color: #9CA3AF;
  }
}
`;

const CloseButton = styled.button`
  position: absolute;
  top: 0px;
  bottom: 0px;
  right: 8px;
  margin: auto;
  height: 28px;
  width: 28px;
  border-style: none;
  padding: 4px;
  color: #9CA3AF;
  background-color: transparent;
  outline: 2px solid transparent;
  outline-offset: 2px;
  &:hover {
    color: white;
  }
  &:focus {
    border-style: none;
    outline: 2px solid transparent;
    outline-offset: 2px;
  }
`;