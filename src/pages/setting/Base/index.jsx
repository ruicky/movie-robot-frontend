import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import LanguageIcon from '@mui/icons-material/Language';
import FolderIcon from '@mui/icons-material/Folder';
function BaseSettingList() {
    const navigate = useNavigate();
    return (
        <List
            sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
            // subheader={<ListSubheader>其他设置</ListSubheader>}
        >
            <ListItem divider>
                <ListItemButton onClick={() => navigate("/setting/edit-web")}>
                    <ListItemIcon>
                        <LanguageIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="Web设置"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton onClick={() => navigate("/config/media-path")}>
                    <ListItemIcon>
                        <FolderIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="存储路径设置"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default BaseSettingList;