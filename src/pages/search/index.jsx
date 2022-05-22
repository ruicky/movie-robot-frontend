import React, {useEffect, useState} from 'react';
import styled from "styled-components/macro";
import {Button, Card, CardContent, IconButton, InputAdornment, OutlinedInput, Paper, Typography} from "@mui/material";
import {Search as SearchIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useGetJuzi} from "@/api/CommonApi";
import message from "@/utils/message";
import {SmallButton} from "@/components/core/SmallButton";


const SearchPage = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState();
    const [randomMedia, setRandomMedia] = useState({});
    const {mutateAsync: getJuzi, isLoading} = useGetJuzi();
    const refreshRandomMedia = () => {
        getJuzi({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setRandomMedia(data);
                }
            },
            onError: error => message.error(error)
        });
    }
    useEffect(() => {
        refreshRandomMedia();
    }, [])
    const onSearch = (keyword) => {
        navigate("/movie/search?keyword=" + keyword)
    }
    return (
        <PageWrapper backdropUrl={randomMedia?.backdrop_url|| '/static/img/default_backdrop.jpeg'}>
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
                    autoFocus
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
                            {randomMedia.juzi}
                            <div style={{textAlign: 'right'}}><Button variant="text"
                                                                        onClick={() => onSearch(randomMedia.name)}>《{randomMedia.name}》</Button>
                                <SmallButton onClick={()=>refreshRandomMedia()}>换一句</SmallButton>
                            </div>
                        </Typography>
                    </CardContent>
                </Card>
            </TextWrapper>

        </PageWrapper>
    );
}

const PageWrapper = styled(Paper)`
  background-image: ${(props) => "url(" + props.backdropUrl + ")"};
  opacity: 0.8;
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