import {IconButton, List as MuiList, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import React from "react";
import styled from "styled-components/macro";
import DeleteIcon from "@mui/icons-material/Delete";

const List = styled(MuiList)`
    width: 100%;
    background-color: background.paper
`
const RuleItem = ({name, desc, disablePadding = true}) => {
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
export const RenameRuleList = () => {
    return (
        <List>
            <RuleItem name={"替换搜索结果文本"} desc={"/{{episode}}\\s*下/ 替换为 {{episode+1}}"}/>
            <RuleItem name={"替换文件名文本"} desc={"/{{episode}}.+Part2/ 替换为 {{episode+1}}"}/>
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