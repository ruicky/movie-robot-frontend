import React from 'react';
import { Dialog, Slide, DialogContent } from '@mui/material';
import styled from "styled-components/macro";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopSearch from './TopSearch';
import SearchTag from './SearchTag';
import SearchHistory from './SearchHistory'

const SearchDialog = ({open, onClose}) => {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // TODO: 对接数据
  const SiteList = [{
    name: '馒头',
    value: 'm-team'
  },
  {
    name: '彩虹岛',
    value: 'chd'
  },
  {
    name: '不可说',
    value: 'spring'
  },
];
  const TagList = [
    {
      name: '电影',
      value: 'movie'
    },
    {
      name: '剧集',
      value: 'tv'
    },
  ];
  return(
    <Dialog open={true} TransitionComponent={Transition} onClose={onClose} fullScreen={isFullScreen} >
      <DialogContentWrap>
        <TopSearch />
        <SearchTag sx={{ mt:4, mb: 5 }} title='站点' list={SiteList} />
        <SearchTag sx={{ mt:4, mb: 5 }} title='分类' list={TagList} />
        <SearchHistory sx={{ mt: 8, mb: 5 }} />
      </DialogContentWrap>
    </Dialog>
  )
}

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const DialogContentWrap = styled(DialogContent)`
  ${(props) => props.theme.breakpoints.up("sm")} {
    height: 500px;
    width: 400px;
  }
`;

export default SearchDialog;