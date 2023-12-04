import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import ListItemIcon from "@mui/material/ListItemIcon";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import { useNavigate } from "react-router-dom";
import { useGetNotifyChannelList } from "@/api/SettingApi";

function Icon({ url }) {
    return <img src={url} height="32" width="32" />;
}

function SelectDialog({ open, handleClose, configured = [] }) {
    const navigate = useNavigate();
    const { data: channelList } = useGetNotifyChannelList();
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>选择要添加的推送应用</DialogTitle>
            <List sx={{ pt: 0 }}>
                {channelList?.data && channelList.data.map((item) => (
                    <ListItem
                        key={item.channel_type}
                        disabled={configured.includes(item.channel_type)} button
                        onClick={() => navigate("/setting/edit-notify?type=" + item.channel_type)}>
                        <ListItemIcon>
                            <Icon url={item.icon_url} />
                        </ListItemIcon>
                        <ListItemText primary={item.name} />
                        <ArrowForwardIosOutlinedIcon color="disabled" />
                    </ListItem>))}
            </List>
        </Dialog>
    );
}

export default SelectDialog;