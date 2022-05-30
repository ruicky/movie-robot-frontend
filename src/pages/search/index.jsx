import React, {useEffect, useState} from 'react';
import styled from "styled-components/macro";
import {Button, Card, CardContent, IconButton, InputAdornment, OutlinedInput, Paper, Typography} from "@mui/material";
import {Search as SearchIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import {useGetDailyMedia, useGetJuzi} from "@/api/CommonApi";
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
    const [media, setMedia] = useState({});
    const {mutateAsync: getDailyMedia, isLoading} = useGetDailyMedia();
    const [isFoucs, setIsFoucs] = useState(false);

    const refreshRandomMedia = () => {
        getDailyMedia({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setMedia(data);
                    localStorage.setItem('dailyMedia', JSON.stringify({
                        data: data,
                        date: new Date().format('yyyy-MM-dd')
                    }))
                }
            },
            onError: error => message.error(error)
        });
    }
    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem("dailyMedia"));
        let dailyMedia = null;
        if (data) {
            if (data.date === new Date().format('yyyy-MM-dd')) {
                dailyMedia = data.data;
            } else {
                localStorage.removeItem('backdropUrlJson');
            }
        }
        if (dailyMedia === null) {
            refreshRandomMedia();
        }else{
            setMedia(dailyMedia);
        }
    }, [])
    const onSearch = (keyword) => {
        navigate("/movie/search?keyword=" + keyword)
    }
    return (
        <PageWrapper backdropUrl={media?.backdrop_url || '/static/img/default_backdrop.jpeg'}>
            <Inputwrapper isFoucs={isFoucs || value}>
                <Input
                    isFoucs={isFoucs || value}
                    backdropUrl={media?.backdrop_url || '/static/img/default_backdrop.jpeg'}
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
                            {media.comment}
                            <div style={{textAlign: 'right'}}><Button variant="text"
                                                                      onClick={() => onSearch(media.name)}>《{media.name}》</Button>
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
  ${(props) => props.theme.breakpoints.up("md")} {
    border-radius: 24px;    
    /* background-color: #fff; */
  }
  
  border-radius: 6px;
  height: 100%;
  position: relative;
  color: black;
  z-index: 2;
  box-sizing: border-box;
  /* background-color: #fff; */
  box-shadow: 0 0 0 1px rgb(0 0 0 / 10%), 0 2px 4px 1px rgb(0 0 0 / 18%);
  ${(props) => props.theme.breakpoints.down("md")} {
    input {
        padding: 0;
    }
   
  }
  overflow: hidden;
    &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        -webkit-filter: blur(50px);
        -moz-filter: blur(50px);
        -ms-filter: blur(50px);
        -o-filter: blur(50px);
        filter: blur(50px);
        z-index: -3;
        margin: -30px;
        background-color: ${(props)=> props.isFoucs ? '#fff' : ''};
        background-image: ${(props) => props.isFoucs ? '' : "url(" + props.backdropUrl + ")"};
        background-position: center top;
        background-size: cover;
        background-attachment: fixed;
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