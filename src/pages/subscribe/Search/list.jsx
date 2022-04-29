import React from 'react';
import {Box} from "@mui/material";
import styled from "styled-components/macro";
import CircularProgress from '@mui/material/CircularProgress';
import TitleCard from "@/pages/subscribe/components/TitleCard";
import RatingLabel from "@/pages/subscribe/components/RatingLabel";
import Empty from "@/pages/subscribe/components/Empty";

const Subject = ({media}) => {
    if (media.type === "Movie") {
        return (
            <span> {media?.release_year}</span>
        )
    } else {
        return (
            <span>{media?.season_year}</span>
        )
    }

}

function getYear(media) {
    if (!media) {
        return "";
    }

    if (media?.type === "Movie") {
        return media?.release_year;
    } else {
        if (media?.season_year) {
            return "第" + media.season_index + "季(" + media?.season_year + ")"
        }
    }
}

const SearchListView = ({items, isLoading, filterNameList}) => {
    const isEmpty = isLoading === false && items?.length === 0;
    if (isLoading) {
        return (
            <Box sx={{display: 'grid', placeItems: 'center'}}>
                <CircularProgress/>
            </Box>
        );
    }
    if (isEmpty) {
        return (<Empty/>)
    }
    return (
        <Ul>
            {/* {
        isEmpty && <Empty />
      } */}
            {
                items?.map((title, index) => {
                    return <li key={title.id}>
                        <TitleCard
                            key={'card' + title.id}
                            sub_id={title?.sub_id}
                            key={'card' + title.id}
                            canExpand
                            id={title.id}
                            image={title?.poster_path}
                            summary={title?.desc}
                            title={title?.cn_name || title?.en_name}
                            year={getYear(title)}
                            mediaType={title?.type}
                            status={title?.status}
                            extra={title}
                            subject={<RatingLabel rating={title?.rating}/>}
                            filterNameList={filterNameList}
                        />
                    </li>;
                })
            }
        </Ul>
    )
}

export default SearchListView;

const Ul = styled.ul`
  list-style: none;
  margin: '10px 0';
  padding: 0;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(159px, 1fr));
`;