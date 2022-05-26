import * as React from 'react';
import {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import styled from "styled-components/macro";
import {css} from "styled-components";
import {useGetMovieMetadata} from "@/api/SettingApi";
import message from "@/utils/message";
import HealthStatus from "@/pages/setting/components/HealthStatus";

function MovieMetadataSettingList() {
    const navigate = useNavigate();
    const [movieMetadata, setMovieMetadata] = useState({});
    const {mutateAsync: getMovieMetadata, isLoading} = useGetMovieMetadata();
    useEffect(() => {
        getMovieMetadata({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setMovieMetadata(data);
                }
            },
            onError: error => message.error(error)
        });
    }, [])
    return (
        <List
            sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
            subheader={<ListSubheader>媒体数据</ListSubheader>}
        >
            <ListItem divider>
                <ListItemButton onClick={() => navigate("/setting/edit-tmdb")}>
                    <ListItemIcon>
                        <ImgWrapper src="/static/img/tmdb.png" disabled={movieMetadata.tmdb_status === 0}/>
                    </ListItemIcon>
                    <ListItemText/>
                    <HealthStatus status={movieMetadata.tmdb_status}/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem divider>
                <ListItemButton  onClick={() => navigate("/setting/edit-douban")}>
                    <ListItemIcon>
                        <ImgWrapper src="/static/img/douban.png" disabled={movieMetadata.douban_status === 0}/>
                    </ListItemIcon>
                    <ListItemText/>
                    <HealthStatus status={movieMetadata.douban_status}/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton onClick={() => navigate("/setting/edit-fanart")}>
                    <ListItemIcon>
                        <ImgWrapper src="/static/img/fanart.png" disabled={movieMetadata.fanart_status === 0}/>
                    </ListItemIcon>
                    <ListItemText/>
                    <HealthStatus status={movieMetadata.fanart_status}/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

const grayStyle = css`
    -webkit-filter: grayscale(100%);
    -moz-filter: grayscale(100%);
    -ms-filter: grayscale(100%);
    -o-filter: grayscale(100%);
    filter: grayscale(100%);
    filter: gray;
`;

const ImgWrapper = styled.img`
    /* 默认宽为 260px */
    width: 180px;
    /* 这里是只要是比 md 小的就设置宽慰 110 像素 */
    ${(props) => props.theme.breakpoints.down("md")} {
        width: 110px;
    }
    ${(props) => props.disabled && grayStyle};
`;
export default MovieMetadataSettingList;