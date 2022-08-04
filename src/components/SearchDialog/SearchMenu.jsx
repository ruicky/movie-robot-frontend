import React,{useState} from 'react';
import { Stack, Button as MuiButton } from '@mui/material';
import styled from "styled-components/macro";


const SearchMenu = () => {
  const [checked, setChecked] = useState('all');
  const list = [
    {
      name: 'all',
      text: '综合'
    },
    {
      name: 'movie',
      text: '电影'
    },
    {
      name: 'tv',
      text: '剧集'
    },
  ]

  return(
    <Stack spacing={2} direction="row" justifyContent="center" sx={{mb: 2}}>
      {
        list.map(
          item =>
            <Button
              variant={checked === item.name ? 'contained' : 'text'}
              onClick={() => setChecked(item.name)}>
              {item.text}
            </Button>
        )
      }
    </Stack>
  );
}

const Button = styled(MuiButton)`
  border-radius: 50px;
`;

export default SearchMenu;