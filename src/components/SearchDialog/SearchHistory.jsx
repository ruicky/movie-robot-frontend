import React from 'react';
import {Avatar, Box, Divider, Typography, Stack} from '@mui/material';
import LinesEllipsis from 'react-lines-ellipsis'
import {green, orange, teal} from '@mui/material/colors';
import {useSearchKeywordCache} from "@/api/MovieApi";
import {useNavigate} from "react-router-dom";
import {
  ChevronRight as ChevronRightIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  Done as DoneIcon,
  ErrorOutlineOutlined as ErrorOutlineOutlinedIcon,
  HourglassTop as HourglassTopIcon,
  ManageSearch as ManageSearchIcon,
} from '@mui/icons-material'
import OpenExtend from "./OpenExtend";

const LIMIT_COUNT = 6;

const SearchHistory = ({title = '最近搜索', sx, onClose}) => {
    const navigate = useNavigate();

    const {data: cache, isLoading} = useSearchKeywordCache()
    const [sliceNum, setSliceNum] = React.useState(LIMIT_COUNT);
    const handleOpenClick = (open) => {
        setSliceNum(open ? 100000 : LIMIT_COUNT)
    }

    const handleDelete = () => {
        //TODO: 对接全部删除接口
    }

    if (cache?.data?.length === 0) return (<></>);
    return (
        <Box sx={{...sx}}>
            <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
                <Typography variant="caption" display="block" gutterBottom color="text.disabled">
                    {title}
                </Typography>
                <Box sx={{display: 'flex'}}>
                    { cache?.data.length > LIMIT_COUNT && <OpenExtend onClick={handleOpenClick} />}
                    {/*<IconButton aria-label="delete" onClick={handleDelete}>*/}
                    {/*    <DeleteIcon fontSize="small"/>*/}
                    {/*</IconButton>*/}
                </Box>
            </Box>
            <Divider light/>
            { !isLoading && <Empty data={cache?.data} />}
            <Box sx={{mt: 2, display: 'grid', gridTemplateColumns: '1fr 1fr'}}>
                {
                    cache?.data?.slice(0, sliceNum)?.map((item, index) => (
                        <ListItem key={index} name={item.keyword} status={item.status} onClick={() => {
                            navigate(`/movie/search?cache=true&keyword=${item.keyword}&searchDouban=${item.searchDouban}&searchMediaServer=${item.searchMediaServer}&searchSite=${item.searchSite}`)
                            if (onClose) {
                                onClose();
                            }
                        }}/>))
                }
            </Box>
        </Box>
    );
}

const Empty = ({data}) => {
  if (data) return (<></>)
  return (
    <Stack direction="column" justifyContent="center" alignItems="center">
      <ManageSearchIcon sx={{fontSize: 100, color: 'text.secondary', opacity: 0.5}} />
      <Typography sx={{color:  'text.secondary', opacity: 0.5}}>
        没有最近在搜索内容
      </Typography>
    </Stack>
  );
}

const ListItem = ({name, status, onClick}) => {
    return (
        <Box sx={{display: 'flex', alignItems: 'center', cursor: 'pointer', mt: 2}} onClick={onClick}>
            {
                status && <Avatar variant="rounded" sx={{bgcolor: 'transparent', width: 18, height: 18, mr: 1}}>
                    {
                        status === 'success'
                            ? <DoneIcon sx={{color: green[300]}}/>
                            : (status === 'searching'
                                    ? <HourglassTopIcon sx={{color: orange[200]}}/>
                                    : <ErrorOutlineOutlinedIcon sx={{color: teal[900]}}/>
                            )
                    }
                </Avatar>
            }

            <Typography color='text.secondary'>
                <LinesEllipsis text={name} maxLine={3}/>
            </Typography>
            <ChevronRightIcon fontSize="small"/>
        </Box>
    );
}

const OpenOrClose = ({data, onClick}) => {
    const [open, setOpen] = React.useState(false);
    if (data?.length <= LIMIT_COUNT) return (<></>);
    const handleClick = () => {
        setOpen(!open)
        onClick(!open)
    }
    return (
        <Box
            sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'text.disabled'}}
            onClick={handleClick}
        >
            {open ? "收起" : "展开"}
            {
                open
                    ? <ExpandLessIcon sx={{width: '15px'}}/>
                    : <ExpandMoreIcon sx={{width: '15px'}}/>
            }
        </Box>
    );
}

export default SearchHistory;