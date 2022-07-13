import React, {useState} from 'react';
import { Dialog, Slide, DialogContent } from '@mui/material';
import styled from "styled-components/macro";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopSearch from './TopSearch';
import SearchTag from './SearchTag';
import SearchHistory from './SearchHistory'
import { set } from 'lodash';

const SearchDialog = ({open, onClose}) => {
  const theme = useTheme();
  const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  // TODO: 对接数据
  const SiteList = [{
    name: '馒头',
    value: 'm-team',
    avatar: 'https://kp.m-team.cc/favicon.ico'
  },
  {
    name: '彩虹岛',
    value: 'chd',
    avatar: 'https://chdbits.co/favicon.ico'
  },
  {
    name: '不可说',
    value: 'spring',
    avatar: 'https://springsunday.net/favicon.ico'
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
  
  const [site, setSite] = useState(SiteList.reduce((a, v) => ({ ...a, [v.value]: true}), {}));
  const [category, setCategory] = useState(TagList.reduce((a, v) => ({ ...a, [v.value]: true}), {}));

  const handleClose = () => {
    // 重置状态
    // setSite();
    // setCategory(undefined);
    onClose();
  }
  return(
    <Dialog open={open} TransitionComponent={Transition} onClose={handleClose} fullScreen={isFullScreen} >
      <DialogContentWrap>
        <TopSearch onClose={handleClose} site={site} category={category} />
        <SearchTag sx={{ mt:4, mb: 5 }} title='站点' list={SiteList} onClick={(name, value) => setSite({...site, [name]: value})} checkData={site} />
        <SearchTag sx={{ mt:4, mb: 5 }} title='分类' list={TagList} onClick={(name, value) => setCategory({...category, [name]: value})} checkData={category} />
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