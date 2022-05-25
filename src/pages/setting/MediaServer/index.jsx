import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {Chip, ListItemButton, Paper, SvgIcon} from "@mui/material";
import {ReactComponent as EmbyIcon} from "../Icon/emby.svg";
import {ReactComponent as JellyfinIcon} from "../Icon/jellyfin.svg";
import {ReactComponent as PlexIcon} from "../Icon/plex.svg";
import {Add as AddIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
function MediaServerSettingList() {
    const navigate = useNavigate();
    return (
            <List
                sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper',mb:4}}
                subheader={<ListSubheader>媒体服务器设置</ListSubheader>}
            >
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <SvgIcon fontSize="large" component={EmbyIcon} viewBox="0 0 400 400"/>
                        </ListItemIcon>
                        <ListItemText primary={"Emby"}
                                      secondary={"http://192.168.1.17:8080"}/>
                        <Chip size="small" label="可连接" color="success"/>
                        <ArrowForwardIosOutlinedIcon color="disabled"/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <SvgIcon fontSize="large" component={JellyfinIcon} viewBox="0 0 400 400"/>
                        </ListItemIcon>
                        <ListItemText primary="Jellyfin"/>
                        <Chip size="small" label="异常" color="error"/>
                        <ArrowForwardIosOutlinedIcon color="disabled"/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton>
                        <ListItemIcon>
                            <SvgIcon fontSize="large" component={PlexIcon} viewBox="0 0 400 400"/>
                        </ListItemIcon>
                        <ListItemText primary="Transmission"/>
                        <Chip size="small" label="异常" color="error"/>
                        <ArrowForwardIosOutlinedIcon color="disabled"/>
                    </ListItemButton>
                </ListItem>
            </List>
    );
}

export default MediaServerSettingList;