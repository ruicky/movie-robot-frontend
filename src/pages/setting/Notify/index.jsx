import * as React from 'react';
import {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {ListItemButton, SvgIcon, Switch} from "@mui/material";
import {ReactComponent as BarkIcon} from "../Icon/bark.svg";
import {ReactComponent as PushdeerIcon} from "../Icon/pushdeer.svg";
import {ReactComponent as WeixinIcon} from "../Icon/weixin.svg";
import {ReactComponent as TelegramIcon} from "../Icon/telegram.svg";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from '@mui/icons-material/ArrowForwardIosOutlined';
import {useGetNotifySetting, useSetNotifyEnable} from "@/api/SettingApi";
import {Add as AddIcon} from "@mui/icons-material";
import NotificationsIcon from '@mui/icons-material/Notifications';
import SelectDialog from "@/pages/setting/Notify/SelectDialog";
import message from "@/utils/message";

function NotifySettingList() {
    const navigate = useNavigate();
    const [showSelect, setShowSelect] = useState(false);
    const [mediaServer, setMediaServer] = useState([]);
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
                <ListItem>
                    <ListItemButton onClick={() => navigate("/setting/edit-notify-template")}>
                        <ListItemIcon>
                            <NotificationsIcon fontSize={"large"}/>
                        </ListItemIcon>
                        <ListItemText primary="通知模版设置"/>
                        <ArrowForwardIosOutlinedIcon color="disabled"/>
                    </ListItemButton>
                </ListItem>
                {notifySetting && notifySetting?.data && notifySetting.data.map((item, index) => (
                    <ListItem key={index} divider={index !== notifySetting.data.length - 1}>
                        <ListItemButton onClick={() => onButtonClick(item.type, item.name)}>
                            <ListItemIcon>
                                {item.type === "bark" ?
                                    <SvgIcon fontSize="large" component={BarkIcon} viewBox="0 0 400 400"/> : null}
                                {item.type === "qywx" ?
                                    <SvgIcon fontSize="large" component={WeixinIcon} viewBox="0 0 400 400"/> : null}
                                {item.type === "pushdeer" ?
                                    <SvgIcon fontSize="large" component={PushdeerIcon} viewBox="0 0 400 400"/> : null}
                                {item.type === "telegram" ?
                                    <SvgIcon fontSize="large" component={TelegramIcon} viewBox="0 0 400 400"/> : null}
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
                {!mediaServer || mediaServer.length === 0 ? <ListItem>
                    <ListItemButton onClick={() => setShowSelect(true)}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary="添加"/>
                    </ListItemButton>
                </ListItem> : null}
            </List>
        </>
    );
}

export default NotifySettingList;