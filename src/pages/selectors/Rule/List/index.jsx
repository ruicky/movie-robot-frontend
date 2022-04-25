import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import CompareArrowsIcon from '@mui/icons-material/CompareArrows';
import {Add as AddIcon, Delete as DeleteIcon} from "@mui/icons-material";
import React, {useEffect, useState} from "react";
import {Skeleton} from "@mui/lab";
import {getRuleConfigList} from "@/api/ConfigApi";
import message from "@/utils/message";

function RuleItem({ruleName, desc}) {
    return (
        <ListItem
            secondaryAction={
                <Stack direction="row" spacing={1}>
                    <IconButton edge="end" aria-label="delete" onClick={()=>{
                        message.info("排序规则暂不开放设置，敬请期待。")
                    }}>
                        <EditIcon/>
                    </IconButton>
                </Stack>
            }
        >
            <ListItemAvatar>
                <Avatar>
                    <CompareArrowsIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={ruleName} secondary={desc}/>
        </ListItem>
    )
}

function RuleList({data}) {
    const [list, setList] = useState(null);
    const fetchList = () => {
        getRuleConfigList().then(r => {
            if (r.code === 0) {
                setList(r.data)
            }
        })
    }
    useEffect(() => {
        fetchList()
    }, [])
    return (
        <>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                排序规则
            </Typography>
            <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                {list ? list.map((item) => (
                    <RuleItem
                        key={item?.rule_name}
                        ruleName={item?.rule_name}
                        desc={item?.desc}
                    />
                )) : <Skeleton variant="rectangular"/>}
            </List>
        </>
    )
}

export default RuleList;