import React from 'react';
import { Paper, IconButton, InputBase, Typography,Box, Divider, Stack, Avatar } from '@mui/material';
import styled from "styled-components/macro";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LinesEllipsis from 'react-lines-ellipsis'
import DeleteIcon from '@mui/icons-material/DeleteOutlineOutlined';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PendingActionsOutlinedIcon from '@mui/icons-material/PendingActionsOutlined';
import { deepOrange, green, orange, grey, brown,teal } from '@mui/material/colors';
import DoneIcon from '@mui/icons-material/Done';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';

const LIMIT_COUNT = 6;

const SearchHistory = ({title = '最近在搜', sx}) => {
  // TODO: 绑定历史记录接口
  const list = [
    {
      name: '测试历史',
      value: 'test',
      status: 'pending'
    },
    {
      name: '瞬息全宇宙',
      value: '瞬息全宇宙',
      status: 'pending'
    },
    {
      name: '超长文本测试，超长文本测试，超长文本测试，超长文本测试，超长文本测试，超长文本测试。',
      value: '新蜘蛛侠',
      status: 'error'
    },
    {
      name: '新蜘蛛侠',
      value: '新蜘蛛侠',
      status: 'success'
    },
    {
      name: '新蜘蛛侠',
      value: '新蜘蛛侠',
      status: 'success'
    },
    {
      name: '新蜘蛛侠',
      value: '新蜘蛛侠'
    },
    {
      name: '新蜘蛛侠',
      value: '新蜘蛛侠'
    },
    {
      name: '新蜘蛛侠',
      value: '新蜘蛛侠'
    },
    {
      name: '新蜘蛛侠',
      value: '新蜘蛛侠'
    },{
      name: '新蜘蛛侠',
      value: '新蜘蛛侠'
    }
  ]
  const [sliceNum, setSliceNum] = React.useState(LIMIT_COUNT);
  const handleOpenClick = (open) => {
    setSliceNum(open ? 100000 : LIMIT_COUNT)
  }

  const handleDelete = () => {
    //TODO: 对接全部删除接口
  }
 
  if (list.length === 0 ) return (<></>);
  return(
    <Box sx={{ ...sx}}>
      <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
        <Typography variant="caption" display="block" gutterBottom color="text.disabled" >
          {title}
        </Typography>
        <Box sx={{display: 'flex'}}>
          <OpenOrClose data={list} onClick={handleOpenClick} />
          <IconButton aria-label="delete" onClick={handleDelete}>
            <DeleteIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Divider light />
      <Box sx={{mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
        {
          list?.slice(0, sliceNum)?.map(item => (<ListItem name={item.name} status={item.status} />))
        }
    </Box>
    </Box>
  );
}

const ListItem = ({name, status}) => {
  return (
    <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', mt: 2}}>
      {
        status && <Avatar variant="rounded" sx={{ bgcolor: 'transparent', width: 18, height: 18, mr:1}}>
          {
            status === 'success'
              ? <DoneIcon sx={{color: green[300]}} />
              : (status === 'error'
                  ? <ErrorOutlineOutlinedIcon sx={{color: orange[900]}} />
                  : <AccessTimeOutlinedIcon sx={{color: teal[200]}} />
                )
          }
        </Avatar>
      }
      
      <Typography color='text.secondary'>
        <LinesEllipsis text={name} maxLine={1} />
      </Typography>
      <ChevronRightIcon fontSize="small" />
    </Box>
  );
}

const OpenOrClose = ({data, onClick}) => {
  const [open, setOpen] = React.useState(false);
  if (data.length <= LIMIT_COUNT) return (<></>);
  const handleClick = () => {
    setOpen(!open)
    onClick(!open)
  }
  return (
    <Box
      sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'text.disabled'}}
      onClick={handleClick}
    >
      {open ? "收起" :"展开"}
      {
        open
        ? <ExpandLessIcon sx={{width: '15px'}} />
        : <ExpandMoreIcon sx={{width: '15px'}} />
      }
    </Box>
  );
}

export default SearchHistory;