import React from 'react';
import styled from "styled-components/macro";
import Slider from '../Slider';
import TitleCard from '../TitleCard';
import PersonCard from '../PersonCard';
import RatingLabel from "@/pages/subscribe/components/RatingLabel";
import {Grid} from "@mui/material";

const MediaSlider = ({
                         sliderKey,
                         title,
                         isLoading,
                         titles,
                         optionComponent,
                         showSubLogs
                     }) => {
    const finalTitles = titles.slice(0, 20).map((title) => {
        // eslint-disable-next-line default-case
        switch (title?.type?.toUpperCase()) {
            case 'MOVIE':
                return (
                    <TitleCard
                        key={'card' + title.id}
                        sub_id={title?.sub_id}
                        id={title.id}
                        image={title?.poster_path}
                        summary={title?.desc}
                        title={title?.cn_name || title?.en_name}
                        year={title?.release_year}
                        mediaType={title?.type}
                        status={title?.status}
                        extra={title}
                        subject={<RatingLabel rating={title?.rating}/>}
                        showSubLogs={showSubLogs}
                    />
                );
            case 'TV':
                return (
                    <TitleCard
                        key={'card' + title.id}
                        sub_id={title?.sub_id}
                        id={title.id}
                        image={title?.poster_path}
                        summary={title?.desc}
                        title={title?.cn_name || title?.en_name}
                        year={title?.release_year}
                        mediaType={title?.type}
                        status={title?.status}
                        extra={title}
                        season={title?.season}
                        subject={<RatingLabel rating={title?.rating}/>}
                        showSubLogs={showSubLogs}
                    />
                );
            case 'PERSON':
                return (
                    <PersonCard
                        personId={title.id}
                        name={title.name}
                        profilePath={title.profilePath}
                    />
                );
            default:
                return (
                    <TitleCard
                        key={'card' + title.id}
                        sub_id={title?.sub_id}
                        id={title.id}
                        image={title?.poster_path}
                        summary={title?.desc}
                        title={title?.cn_name || title?.en_name}
                        year={title?.release_year}
                        mediaType={title?.type}
                        status={title?.status}
                        extra={title}
                        subject={<RatingLabel rating={title?.rating}/>}
                        showSubLogs={showSubLogs}
                    />
                );
        }
    });

    return (
        <>
            <SliderHeader>
                {
                    optionComponent
                        ? <Grid justifyContent="space-between" container spacing={6}
                                style={{fontSize: '20px', fontWeight: 700, marginBottom: -5}}>
                            <Grid item>
                                <span>{title}</span>
                            </Grid>
                            <Grid item>
                                {optionComponent}
                            </Grid>
                        </Grid>
                        : <LinkWrapper>
                            <span>{title}</span>
                        </LinkWrapper>
                }
            </SliderHeader>
            <Slider
                sliderKey={sliderKey}
                isLoading={isLoading}
                isEmpty={false}
                items={finalTitles}
            />
        </>
    );
}

export default MediaSlider;


const SliderHeader = styled.div`
  position: relative;
  margin-top: 6px;
  margin-bottom: 16px;
  display: flex;
`;

const LinkWrapper = styled.a`
  display: inline-flex;
  align-items: center;
  font-size: 20px;
  line-height: 28px;
  font-weight: 700;
  text-decoration: inherit;
  @media (min-width: 640px) {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 20px;
    line-height: 32px;
    line-height: 36px;
    margin-bottom: -5;
  }

`