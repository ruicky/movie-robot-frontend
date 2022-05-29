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
import {ReactComponent as QbitIcon} from "@/pages/setting/Icon/qbit.svg";
import {ReactComponent as TransmissionIcon} from "@/pages/setting/Icon/transmission.svg";
import {ReactComponent as Aria2Icon} from "@/pages/setting/Icon/aria2.svg";

function SelectDialog({open, handleClose, configured = []}) {
    const navigate = useNavigate();
    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle>选择要添加的下载工具</DialogTitle>
            <List sx={{pt: 0}}>
                <ListItem button onClick={() => navigate("/setting/edit-download-client?type=qbittorrent")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={QbitIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="qBittorrent"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
                <ListItem button onClick={() => navigate("/setting/edit-download-client?type=transmission")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={TransmissionIcon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Transmission"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
                <ListItem button onClick={() => navigate("/setting/edit-download-client?type=aria2")}>
                    <ListItemIcon>
                        <SvgIcon fontSize="large" component={Aria2Icon} viewBox="0 0 400 400"/>
                    </ListItemIcon>
                    <ListItemText primary="Aria2"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItem>
            </List>
        </Dialog>
    );
}

export default SelectDialog;