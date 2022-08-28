import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ListItemIcon from "@mui/material/ListItemIcon";
import {SvgIcon} from "@mui/material";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import {useNavigate} from "react-router-dom";
import {ReactComponent as BarkIcon} from "@/pages/setting/Icon/bark.svg";
import {ReactComponent as WeixinIcon} from "@/pages/setting/Icon/weixin.svg";
import {ReactComponent as PushdeerIcon} from "@/pages/setting/Icon/pushdeer.svg";
import {ReactComponent as TelegramIcon} from "../Icon/telegram.svg";

function SelectDialog({open, handleClose, configured = []}) {
    const navigate = useNavigate();
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>选择要添加的推送应用</DialogTitle>
            <List sx={{pt: 0}}>
                <ListItem disabled={configured.includes("qywx")} button
                          onClick={() => navigate("/setting/edit-notify?type=qywx")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={WeixinIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="企业微信"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
                <ListItem disabled={configured.includes("bark")} button
                          onClick={() => navigate("/setting/edit-notify?type=bark")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={BarkIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Bark"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
                <ListItem disabled={configured.includes("pushdeer")} button
                          onClick={() => navigate("/setting/edit-notify?type=pushdeer")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={PushdeerIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Pushdeer"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
                <ListItem disabled={configured.includes("telegram")} button
                          onClick={() => navigate("/setting/edit-notify?type=telegram")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={TelegramIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Telegram"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default SelectDialog;