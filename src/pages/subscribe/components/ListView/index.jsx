import React from 'react';
import TitleCard from '../TitleCard';
import { Grid } from "@mui/material";
import styled from "styled-components/macro";
import Empty from '../Empty';


const ListView = ({items}) => {
  return (
    <Grid
      container={true}
      spacing={2}
    >
      {
        items.length === 0 && <Empty />
      }
      {
        items?.map((title, index) => {
          return <Grid item>
            <TitleCard
              id={title.id}
              image={title.image}
              summary={title.summary}
              title={title.title}
              year={title.year}
              mediaType={title.mediaType}
              status={title.status}
            />
          </Grid>;
        })
      }
    </Grid>
  )
}

export default ListView