import React, {useEffect, useState} from 'react';
import styled from "styled-components/macro";
import {Button, Card, CardContent, IconButton, InputAdornment, OutlinedInput, Paper, Typography} from "@mui/material";
import {Search as SearchIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useGetJuzi} from "@/api/CommonApi";
import message from "@/utils/message";
import {SmallButton} from "@/components/core/SmallButton";

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

const SearchPage = () => {
    const navigate = useNavigate();
    const [value, setValue] = useState();
    const [backdropUrl, setBackdropUrl] = useState(null);
    const [randomMedia, setRandomMedia] = useState({});
    const {mutateAsync: getJuzi, isLoading} = useGetJuzi();
    const [isFoucs, setIsFoucs] = useState(false);

    const refreshRandomMedia = (localBackdropUrl) => {
        getJuzi({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setRandomMedia(data);
                    if (localBackdropUrl) {
                        setBackdropUrl(localBackdropUrl);
                    } else {
                        setBackdropUrl(data.backdrop_url);
                        localStorage.setItem('backdropUrlJson', JSON.stringify({
                            backdropUrl: data.backdrop_url,
                            date: new Date().format('yyyy-MM-dd')
                        }))
                    }
                }
            },
            onError: error => message.error(error)
        });
    }
    useEffect(() => {
        const backdropUrlJson = JSON.parse(window.localStorage.getItem("backdropUrlJson"));
        let backdropUrl = null;
        if (backdropUrlJson) {
            if (backdropUrlJson.date === new Date().format('yyyy-MM-dd')) {
                backdropUrl = backdropUrlJson.backdropUrl;
            } else {
                localStorage.removeItem('backdropUrlJson');
            }
        }
        refreshRandomMedia(backdropUrl);

    }, [])
    const onSearch = (keyword) => {
        navigate("/movie/search?keyword=" + keyword)
    }
    return (
        <PageWrapper backdropUrl={backdropUrl || '/static/img/default_backdrop.jpeg'}>
            <Inputwrapper isFoucs={isFoucs || value}>
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
                    onFocus={() => setIsFoucs(true)}
                    onBlur={() => setIsFoucs(false)}
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
                                <SmallButton onClick={() => refreshRandomMedia(null)}>换一个</SmallButton>
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
    opacity: ${(props) => props.isFoucs ? 0.8 : 0.5};
    ${(props) => props.theme.breakpoints.up("md")} {
      width: 78%;
      min-height: 40px;
      max-height: 52px;
      height: 100%;
      min-width: 580px;
      max-width: 596px;
      top: 15%;
    }
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
  input {
    padding: 0;
  }
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