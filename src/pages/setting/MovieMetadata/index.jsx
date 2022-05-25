import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {Chip, ListItemButton, SvgIcon} from "@mui/material";
import {useNavigate} from "react-router-dom";
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

function MovieMetadataSettingList() {
    const navigate = useNavigate();
    return (
        <List
            sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
            subheader={<ListSubheader>媒体元数据设置</ListSubheader>}
        >
            <ListItem>
                <ListItemButton>
                    <ListItemText/>
                    <Chip size="small" label="可连接" color="success"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton>
                    <ListItemText/>
                    <Chip size="small" label="未设置" color="primary"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default MovieMetadataSettingList;