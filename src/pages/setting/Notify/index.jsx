import * as React from 'react';
import {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {ListItemButton, Switch} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import {useGetNotifySetting, useSetNotifyEnable} from "@/api/SettingApi";
import {Add as AddIcon} from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SelectDialog from "@/pages/setting/Notify/SelectDialog";
import message from "@/utils/message";

function Icon({url}) {
    return <img src={url} height="32" width="32"/>;
}

function NotifySettingList() {
    const navigate = useNavigate();
    const [showSelect, setShowSelect] = useState(false);
    const {data: notifySetting, isLoading, refetch} = useGetNotifySetting();
    const {mutateAsync: setNotifyEnable, isLoading: isSetting} = useSetNotifyEnable();
    const getTypeStr = (type) => {
        if (type) {
            if (type === "qywx") {
                return "企业微信"
            }
            return type.replace(/^\S/, s => s.toUpperCase());
        } else {
            return ""
        }
    }
    const onButtonClick = (type, name) => {
        navigate("/setting/edit-notify?type=" + type + "&name=" + name)
    }
    const onEnableChange = (type, name, checked) => {
        setNotifyEnable({type, name, enable: checked}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    refetch();
                } else {
                    message.error(msg);
                }
            }
        })
    }
    useEffect(() => {

    }, [])
    return (
        <>
            <SelectDialog
                open={showSelect}
                handleClose={() => {
                    setShowSelect(false);
                }}
            />
            <List
                sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
                subheader={<ListSubheader>推送通道</ListSubheader>}
            >
                {notifySetting && notifySetting?.data && notifySetting.data.map((item, index) => (
                    <ListItem key={index} divider={index !== notifySetting.data.length - 1}>
                        <ListItemButton onClick={() => onButtonClick(item.type, item.name)}>
                            <ListItemIcon>
                                <Icon url={item.icon_url}/>
                            </ListItemIcon>
                            <ListItemText primary={item.name}/>
                            <Switch
                                edge="end"
                                checked={item?.enable}
                                onClick={e => e.stopPropagation()}
                                onChange={(e) => onEnableChange(item.type, item.name, e.target.checked)}
                                inputProps={{
                                    'aria-labelledby': 'switch-list-label-bluetooth',
                                }}
                            />
                            <ArrowForwardIosOutlinedIcon color="disabled"/>
                        </ListItemButton>
                    </ListItem>
                ))}
                <ListItem>
                    <ListItemButton onClick={() => navigate("/setting/edit-notify-template")}>
                        <ListItemIcon>
                            <NotificationsIcon fontSize={"large"}/>
                        </ListItemIcon>
                        <ListItemText primary="消息模版设置"/>
                        <ArrowForwardIosOutlinedIcon color="disabled"/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={() => setShowSelect(true)}>
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

export default NotifySettingList;