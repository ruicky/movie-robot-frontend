import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import {ListItemButton} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import LanguageIcon from '@mui/icons-material/Language';
import FolderIcon from '@mui/icons-material/Folder';
import RuleFolderIcon from '@mui/icons-material/RuleFolder';
import FilterListIcon from "@mui/icons-material/FilterList";
import ListSubheader from "@mui/material/ListSubheader";

function DownloadSettingList() {
    const navigate = useNavigate();
    return (
        <List
            sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
            subheader={<ListSubheader>下载设置</ListSubheader>}
        >
            <ListItem divider>
                <ListItemButton onClick={() => navigate("/config/media-path")}>
                    <ListItemIcon>
                        <FolderIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="媒体文件夹"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem divider>
                <ListItemButton onClick={() => navigate("/smartDownload/douban")}>
                    <ListItemIcon>
                        <RuleFolderIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="豆瓣想看与智能下载保存规则"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton onClick={() => navigate("/smartDownload/selectors")}>
                    <ListItemIcon>
                        <FilterListIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="过滤器与排序规则"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default DownloadSettingList;