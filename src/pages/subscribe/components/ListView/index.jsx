import React, {useEffect, useState} from 'react';
import TitleCard from '../TitleCard';
import {Box} from "@mui/material";
import styled from "styled-components/macro";
import Empty from '../Empty';
import CircularProgress from '@mui/material/CircularProgress';
import {getFilterConfigList} from "@/api/ConfigApi";

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

function getTitle(media) {
    if (!media) {
        return "";
    }

    if (media?.type === "Movie") {
        return media?.cn_name || media?.en_name;
    } else {
        return (media?.cn_name || media?.en_name) + " 第" + media.season_index + "季";
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
            return media?.season_year;
        }
    }
}

const ListView = ({items, isLoading}) => {
    const isEmpty = isLoading === false && items?.length === 0;
    const [filterNameList, setFilterNameList] = useState([]);
    const fetchFilterNameListList = () => {
        getFilterConfigList().then(r => {
            if (r.code === 0) {
                setFilterNameList(r.data.map((item) => {
                    return item.filter_name;
                }))
            }
        })
    }
    useEffect(() => {
        fetchFilterNameListList()
    }, [])
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
                            canExpand
                            id={title.douban_id}
                            sub_id={title.id}
                            image={title?.poster_path}
                            summary={title?.desc}
                            title={getTitle(title)}
                            year={getYear(title)}
                            mediaType={title?.type}
                            status={title?.status}
                            extra={title}
                            showBottomTitle={false}
                            filterNameList={filterNameList}
                        />
                    </li>;
                })
            }
        </Ul>
    )
}

export default ListView;

const Ul = styled.ul`
  list-style: none;
  margin: '10px 0';
  padding: 0;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(159px, 1fr));
`;