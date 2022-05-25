import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ListItemIcon from "@mui/material/ListItemIcon";
import {SvgIcon} from "@mui/material";
import {ReactComponent as EmbyIcon} from "@/pages/setting/Icon/emby.svg";
import {ReactComponent as JellyfinIcon} from "@/pages/setting/Icon/jellyfin.svg";
import {ReactComponent as PlexIcon} from "@/pages/setting/Icon/plex.svg";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import {useNavigate} from "react-router-dom";

function SelectDialog({open, handleClose, configured = []}) {
    const navigate = useNavigate();
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>选择要添加的媒体服务器</DialogTitle>
            <List sx={{pt: 0}}>
                <ListItem disabled={configured.includes("emby")} button onClick={() => navigate("/setting/edit-media-server?type=emby")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={EmbyIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Emby"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
                <ListItem disabled={configured.includes("jellyfin")} button onClick={() => navigate("/setting/edit-media-server?type=jellyfin")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={JellyfinIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Jellyfin"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
                <ListItem disabled={configured.includes("plex")} button onClick={() => navigate("/setting/edit-media-server?type=plex")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={PlexIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Plex"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default SelectDialog;