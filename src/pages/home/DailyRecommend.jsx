import React from 'react';
import styled from "styled-components/macro";
import {Chip, Divider, Grid, Link, Paper, Stack, Typography} from "@mui/material";
import {getToday} from '@/utils/date';
import LinesEllipsis from 'react-lines-ellipsis'
import {jumpUrl} from "@/utils/urlUtils";

const DailyRecommend = (data) => {
    const {
        background = "",
        title = "",
        desc = "",
        url, appUrl, rating,
        onPicClick = () => {
            return;
        }
    } = data;
    const date = getToday();
    const {week, month, day, lunar_date} = date;
    const openUrl = (httpUrl, appUrl) => {
        if (!httpUrl || !appUrl) {
            return;
        }
        jumpUrl(httpUrl, appUrl)
    }
    return (
        <PageWrapper background={background} onClick={() => onPicClick()}>
            <Grid container spacing={2} alignItems="flex-end" flexWrap="nowrap"
                  sx={{position: 'absolute', left: '5px', bottom: '10px', px: 2}}>
                <Grid item sx={{minWidth: '90px'}}>
                    <Typography variant="h1" component="div" sx={{fontSize: '3rem', fontWeight: '200', color: '#fff'}}>
                        {day}
                    </Typography>
                    <Stack direction="row" divider={<Divider orientation="vertical" flexItem/>} spacing={1.5}
                           sx={{color: '#fff'}}>
                        <span style={{whiteSpace: 'nowrap'}}>{month}</span>
                        <span style={{whiteSpace: 'nowrap'}}>{week}</span>
                    </Stack>
                    <Typography component="div" sx={{color: '#fff'}}>
                        {lunar_date}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm container direction="column" sx={{ml: 3}}>
                    <Grid item>
                        <Typography variant="h4" component="div" gutterBottom sx={{color: '#fff'}}>
                            <Link sx={{color: '#fff'}} target={"_blank"}
                                  onClick={(e) => {
                                      e.stopPropagation();
                                      openUrl(url, appUrl)
                                  }}>{title}</Link>
                            <Chip
                                size={"small"}
                                sx={{
                                    background: "#FFAC2F",
                                    color: "#000000",
                                    borderRadius: 50,
                                    marginLeft: 2,
                                    fontSize: "11px"
                                }}
                                label={`豆瓣评分 ${rating || '0'}`}/>
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle2" component="div" gutterBottom
                                    sx={{color: '#fff', fontWeight: "bold"}}>
                            <LinesEllipsis text={desc} maxLine={3}
                                           style={{minHeight: '20px', display: 'flex', alignItems: 'center'}}/>
                        </Typography>
                    </Grid>
                </Grid>
            </Grid>
        </PageWrapper>
    );
}

const PageWrapper = styled(Paper)`
  cursor: pointer;
  position: relative;
  border-radius: 30px;
  &::before {
    content: ' ';
    display: block;
    background-image: linear-gradient(to top, #181818, rgba(255, 255, 255, 0)),${(props) => "url(" + props.background + ")"};
    opacity: 0.8;
    background-position: 50% 20% ;
    background-size: cover;
    width: 100%;
    height: 180px;
    color: #fff;
    border-radius: 30px;
  }
`;


export default DailyRecommend;