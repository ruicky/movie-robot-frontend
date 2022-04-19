import React from 'react';
import TitleCard from '../TitleCard';
import { Box } from "@mui/material";
import styled from "styled-components/macro";
import Empty from '../Empty';
import CircularProgress from '@mui/material/CircularProgress';


const ListView = ({items, isLoading}) => {
  const isEmpty = isLoading===false && items?.length === 0;
  if (isLoading) {
    return (
      <Box sx={{ display: 'grid', placeItems:'center' }}>
        <CircularProgress />
      </Box>
    );
  }
  if (isEmpty) {
    return (<Empty />)
  }
  return (
    <Ul>
      {/* {
        isEmpty && <Empty />
      } */}
      {
        items?.map((title, index) => {
          return <li>
            <TitleCard
              id={title.id}
              image={title?.poster_path}
              summary={title?.desc}
              title={title?.cn_name || title?.en_name}
              year={title?.release_year}
              mediaType={title?.type}
              status={title?.status}
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
  margin: 0;
  padding: 0;
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(159px, 1fr));
`;