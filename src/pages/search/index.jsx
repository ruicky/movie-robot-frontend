import React, {useEffect, useState} from 'react';
import styled from "styled-components/macro";
import { Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useGetDailyMedia} from "@/api/CommonApi";
import message from "@/utils/message";
import BottomLayer from './BottomLayer';

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
    const [media, setMedia] = useState({});
    const {mutateAsync: getDailyMedia, isLoading} = useGetDailyMedia();

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
            <BottomLayer media={media} refreshRandomMedia={refreshRandomMedia} onSearch={onSearch} />
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


export default SearchPage;