import * as React from 'react';
import {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {ListItemButton, SvgIcon} from "@mui/material";
import {ReactComponent as EmbyIcon} from "../Icon/emby.svg";
import {ReactComponent as JellyfinIcon} from "../Icon/jellyfin.svg";
import {ReactComponent as PlexIcon} from "../Icon/plex.svg";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import {useGetMediaServer} from "@/api/SettingApi";
import message from "@/utils/message";
import HealthStatus from "@/pages/setting/components/HealthStatus";
import {Add as AddIcon} from "@mui/icons-material";
import SelectDialog from "@/pages/setting/MediaServer/SelectDialog";
import {TextLabel} from "@/pages/setting/components/TextLabel";

function MediaServerSettingList() {
    const navigate = useNavigate();
    const [showSelectMediaServer, setShowSelectMediaServer] = useState(false);
    const [mediaServer, setMediaServer] = useState([]);
    const {mutateAsync: getMediaServer, isLoading} = useGetMediaServer();
    useEffect(() => {
        getMediaServer({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setMediaServer(data);
                }
            },
            onError: error => message.error(error)
        });
    }, [])
    return (
        <>
            <SelectDialog
                open={showSelectMediaServer}
                handleClose={() => {
                    setShowSelectMediaServer(false);
                }}
            />
            <List
                sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
                subheader={
                    <ListSubheader>{mediaServer && mediaServer.length > 0 ? "媒体服务器" : "媒体服务器(必须配置)"}</ListSubheader>}
            >
                {mediaServer && mediaServer.map((item, index) => (
                    <ListItem key={index} divider={index !== mediaServer.length - 1}>
                        <ListItemButton
                            onClick={() => navigate("/setting/edit-media-server?type=" + item.type + "&name=" + item.name)}>
                            <ListItemIcon>
                                {item.type === "emby" ?
                                    <SvgIcon fontSize="large" component={EmbyIcon} viewBox="0 0 400 400"/> : null}
                                {item.type === "jellyfin" ?
                                    <SvgIcon fontSize="large" component={JellyfinIcon} viewBox="0 0 400 400"/> : null}
                                {item.type === "plex" ?
                                    <SvgIcon fontSize="large" component={PlexIcon} viewBox="0 0 400 400"/> : null}
                            </ListItemIcon>
                            <ListItemText
                                primary={<TextLabel text={item.name} chipLabel={item.master_server ? "默认" : null}/>}/>
                            <HealthStatus status={item.status}/>
                            <ArrowForwardIosOutlinedIcon color="disabled"/>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem>
                    <ListItemButton onClick={() => setShowSelectMediaServer(true)}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary="添加"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );
}

export default MediaServerSettingList;