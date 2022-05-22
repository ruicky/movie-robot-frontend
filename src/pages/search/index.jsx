import React,{useState} from 'react';
import styled from "styled-components/macro";
import {Paper, OutlinedInput, InputAdornment, IconButton, Typography, Box, Card, CardContent} from "@mui/material";
import {Search as SearchIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";



const SearchPage = () => {
  const navigate = useNavigate();
  const [value, setValue] = useState();

  const onSearch = (keyword) => {
    navigate("/movie/search?keyword=" + keyword)
  }
  return (
      <PageWrapper>
          <Inputwrapper>
            <Input
              id="input-with-icon-adornment"
              placeholder="搜索"
              sx={{
                mx: 2
              }}
              onChange={({target: {value: v}}) => {
                setValue(v);
              }}
              onKeyUp={(e) => {
                  if ((e.key === 'Enter' || e.key === "NumpadEnter") && value) {
                      onSearch(value);
                  }
              }}
              value={value}
              fullwidth
              endAdornment={
                <InputAdornment sx={{minWidth: '28px', height: '45%'}}>
                    <IconButton type="submit" sx={{p: "10px"}} aria-label="search" onClick={() => {
                            if (value) {
                                onSearch(value);
                            }
                        }}>
                        <SearchIcon sx={{color: '#00809d'}}/>
                    </IconButton>
                </InputAdornment>
              }
            />
          </Inputwrapper>
          <TextWrapper>
            <Card sx={{margin: '0 8px 8px'}}>
              <CardContent>
                <Typography variant="h5" color="text.secondary">
                  贾维斯，在我们学会走之前，要先学会跑！
                  <div style={{textAlign: 'right'}}>--《钢铁侠》</div>
                </Typography>
              </CardContent>
            </Card>
          </TextWrapper>

      </PageWrapper>
  );
}

const PageWrapper = styled(Paper)`
  background-image: url(https://www.themoviedb.org/t/p/original/2ymO6kST1wwtuSlHifAoG2n2fe5.jpg);
  opacity: 1;
  background-position: center;
  background-size: cover;
  position: relative;
  height: 100%;  
  width: 100%;
  border-radius: 0; 
`;

const Inputwrapper = styled.div`
    width: 87%;
    transition: all .1s;
    text-align: center;
    height: 44px;
    top: 25%;
    position: relative;
    margin: auto;
    z-index: 2;
`;

const Input = styled(OutlinedInput)`
  margin: auto 12px;
  box-sizing: border-box;
  padding: 0 8px 0 12px;
  text-align: initial;
  align-items: center;
  display: flex;
  transition: box-shadow .2s;
  border-radius: 6px;
  height: 100%;
  position: relative;
  color: black;
  background-color: #fff;
  box-shadow: 0 0 0 1px rgb(0 0 0 / 10%), 0 2px 4px 1px rgb(0 0 0 / 18%);
`;

const TextWrapper = styled.div`
  color: white;
  left: 0;
  width: 100%;
  position: absolute;
  bottom: 1%;
  margin: auto;
  max-height: 30%;
  z-index: 200;
  opacity: 0.8;
`;

export default SearchPage;