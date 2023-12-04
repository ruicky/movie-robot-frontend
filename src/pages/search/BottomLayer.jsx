import React from 'react';
import styled from "styled-components/macro";
import {Button, Card, CardContent, Box, Tooltip, Typography} from "@mui/material";
import SearchBox from './SearchBox';
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import LinesEllipsis from 'react-lines-ellipsis'


const BottomLayer = ({media, onSearch, refreshRandomMedia}) => {
  const theme = useTheme();
  const isShowSearch = useMediaQuery(theme.breakpoints.down("md"));
  const maxLine = useMediaQuery(theme.breakpoints.up("md")) ? 1 : 5;
  return (
    <TextWrapper>
      <Card sx={{borderRadius: 0, background: 'rgba(0, 45, 98, 0.07)'}}>123
          <CardContent sx={{mb: 2}}>
            {<Box sx={{my: 2}}><SearchBox/></Box>}
            <Tooltip title={media.comment} onClick={() => refreshRandomMedia(null)}>
              <Typography variant="h5" color="#fff" sx={{fontWeight: '600'}}>
                  <LinesEllipsis text={media.comment} maxLine={maxLine}/>
              </Typography>
            </Tooltip>
            <Box sx={{textAlign:"right"}}>
              <Button variant="text"
                sx={{color: '#FFF', padding: '6px 0'}}
                onClick={() => onSearch(media.name)}>《{media.name}》
              </Button>
              {/*<SmallButton sx={{color: "#ffffff"}} onClick={() => refreshRandomMedia(null)}>换一个</SmallButton>*/}
            </Box>
            {/*<Box>*/}
            {/*  <Rated>*/}
            {/*    PG-13*/}
            {/*  </Rated>*/}
            {/*  <TagText>*/}
            {/*    2018-05-12*/}
            {/*  </TagText>*/}
            {/*  <TagText>*/}
            {/*    冒险, 动作, 科幻*/}
            {/*  </TagText>*/}
            {/*  <TagText>*/}
            {/*    2 小时 36 分钟*/}
            {/*  </TagText>*/}
            {/*</Box>*/}
          </CardContent>
      </Card>
  </TextWrapper>
  )
};

const TextWrapper = styled.div`
  color: white;
  left: 0;
  width: 100%;
  position: absolute;
  bottom: 0;
  margin: auto;
  max-height: 40%;
  z-index: 200;
  background: rgba(0, 0, 0, 0.1);
  box-shadow: 0px 5px 8px 0px rgba(0, 45, 98, 0.07);
  backdrop-filter: blur(5px) saturate(180%);
`;

const Rated = styled.span`
  border-radius: 3px;
  opacity: 0.5;
  border: 2px solid #FFFFFF;
  font-weight: bold;
  color: #FFFFFF;
  line-height: 16px;
  margin-right: 10px;
`;

const TagText = styled.span`
  font-size: 14px;
  font-weight: 400;
  color: #FFFFFF;
  margin-right: 10px;
`;

export default BottomLayer;