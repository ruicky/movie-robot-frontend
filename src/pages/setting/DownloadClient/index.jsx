import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {Chip, ListItemButton, SvgIcon, Divider} from "@mui/material";
import {ReactComponent as QbitIcon} from "../Icon/qbit.svg";
import {ReactComponent as TransmissionIcon} from "../Icon/transmission.svg";
import {Add as AddIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
function TextLabel({text, chipLabel = null, chipColor = "success"}) {
    return (
        <>
            {text}
            {chipLabel ?
                <Chip label={chipLabel} size="small" color={chipColor} style={{borderRadius: 50}} sx={{ml: 2}}/> : null}
        </>
    );
}

function DownloadSettingList() {
    const navigate = useNavigate();
    return (
        <List
            sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
            subheader={<ListSubheader>下载工具设置</ListSubheader>}
        >
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={QbitIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary={<TextLabel text="qBittorrent" chipLabel="默认"/>}
                                  secondary={"http://192.168.1.17:8080"}/>
                    <Chip sx={{mr: 2}} size="small" label="可连接" color="success"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemButton>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={TransmissionIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Transmission"/>
                    <Chip sx={{mr: 2}} size="small" label="异常" color="error"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <Divider />
            <ListItem>
                <ListItemButton onClick={() => navigate("/smartDownload/edit-filter")}>
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="添加"/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default DownloadSettingList;