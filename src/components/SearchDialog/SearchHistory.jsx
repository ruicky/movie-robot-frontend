import React from 'react';
import { Paper, IconButton, InputBase, Typography,Box, Divider, Stack } from '@mui/material';
import styled from "styled-components/macro";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LinesEllipsis from 'react-lines-ellipsis'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';

const SearchHistory = ({title = '最近在搜', sx}) => {
  const list = [{
    name: '测试历史',
    value: 'test'
  },
  {
    name: '瞬息全宇宙',
    value: '瞬息全宇宙'
  },
  {
    name: '超长文本测试，超长文本测试，超长文本测试，超长文本测试，超长文本测试，超长文本测试。',
    value: '新蜘蛛侠'
  },
  {
    name: '新蜘蛛侠',
    value: '新蜘蛛侠'
  },
]
  return(
    <Box sx={{ ...sx}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <Typography variant="caption" display="block" gutterBottom color="text.disabled" >
          {title}
        </Typography>
        <IconButton aria-label="delete">
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
      <Divider light />
      <Box sx={{mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        {
          list?.map(item => (<ListItem name={item.name} />))
        }
    </Box>
    </Box>
  );
}

const ListItem = ({name}) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', mt: 2}}>
      <Typography color='text.secondary'>
        <LinesEllipsis text={name} maxLine={1} />
      </Typography>
      <ChevronRightIcon fontSize="small" />
    </Box>
  );
}

export default SearchHistory;