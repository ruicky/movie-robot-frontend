import React, {useEffect, useState} from 'react';
import styled from "styled-components/macro";
import { Paper} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {useGetDailyMedia} from "@/api/CommonApi";
import message from "@/utils/message";
import BottomLayer from './BottomLayer';

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