import {IconButton, List as MuiList, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import styled from "styled-components/macro";
import {Add as AddIcon} from "@mui/icons-material";

const List = styled(MuiList)`
    width: 100%;
    background-color: background.paper
`
const FilterItem = ({name, desc, disablePadding = true}) => {
    return (<ListItem
        secondaryAction={
            <IconButton edge="end" aria-label="comments">
                <DeleteIcon/>
            </IconButton>
        }
        disablePadding={disablePadding}
    >
        <ListItemButton>
            <ListItemText
                primary={name}
                secondary={desc}
            />
        </ListItemButton>
    </ListItem>);
}
const TorrentFilterList = () => {
    return (
        <List>
            <FilterItem name={"种子名&标题"} desc={"同时匹配：脱口秀大会 第五季"}/>
            <FilterItem name={"制作组"} desc={"ADE / ADWeb"}/>
            <FilterItem name={"文件大小"} desc={"大于 > 8124 MB 并且 小于 < 20000 MB"}/>
            <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="添加"/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}
export default TorrentFilterList;