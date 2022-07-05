import React from 'react';
import { Paper, IconButton, InputBase, Typography,Box, Divider, Stack, Checkbox, FormGroup, FormControlLabel, Chip, Avatar } from '@mui/material';
import styled from "styled-components/macro";
import DoneIcon from '@mui/icons-material/Done';

const SearchTag = ({title, sx, list, onClick}) => {
  const [data, setData] = React.useState([]);

  const handleClick = (item) => {
    if (data.includes(item.value)) {
      console.log('data.filter(x => x!== item.value)', data.filter(x => x!== item.value));
      setData(data.filter(x => x!== item.value))
    } else {
      data.push(item.value)
      setData(Array.from(new Set(data)))
    }
    console.log('data-->', data);
  }
  const Icon = (item) => {
    console.log('data.includes(item.value)-->', data.includes(item.value));
    if (data.includes(item.value)) {
      return (
        <></>
      );
    }
    return <DoneIcon/>
  }
  return(
    <Box sx={{...sx }}>
      <Typography variant="caption" display="block" color="text.disabled" gutterBottom >
        {title}
      </Typography>
      <Divider light />
      <Stack spacing={2} direction="row" sx={{mt: 2}}>
        {
          list?.map(item => (
            // <>
            //   <Checkbox size="small" />
            //   <Typography color='info.main'  sx={{cursor: 'pointer'}} onClick={() => onClick && onClick(item)}>{item.name}</Typography>
            // </>
            <Chip
            label={item.name}
            onClick={() => handleClick(item)}
            avatar={item.avatar && <Avatar src={item.avatar} />}
            // icon={<DoneIcon/>}
            deleteIcon={<Icon item={item}/>}
            onDelete={() => handleClick(item)}
            size="small"
          />
           
          ))
        }
      </Stack>
    </Box>
  );
}

export default SearchTag;