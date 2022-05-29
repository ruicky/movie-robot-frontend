import * as React from 'react';
import {useEffect, useState} from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {Chip, ListItemButton, SvgIcon} from "@mui/material";
import {ReactComponent as QbitIcon} from "../Icon/qbit.svg";
import {ReactComponent as TransmissionIcon} from "../Icon/transmission.svg";
import {Add as AddIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import {useGetDownloadClient} from "@/api/SettingApi";
import message from "@/utils/message";
import HealthStatus from "@/pages/setting/components/HealthStatus";
import SelectDialog from "@/pages/setting/DownloadClient/SelectDialog";

function TextLabel({text, chipLabel = null, chipColor = "success"}) {
    return (
        <>
            {text}
            {chipLabel ?
                <Chip label={chipLabel} size="small" color={chipColor} style={{borderRadius: 50}} sx={{ml: 2}}/> : null}
        </>
    );
}

function DownloadSettingList() {
    const navigate = useNavigate();
    const [showSelect, setShowSelect] = useState(false);
    const [downloadClient, setdownloadClient] = useState([]);
    const {mutateAsync: getDownloadClient, isLoading} = useGetDownloadClient();
    useEffect(() => {
        getDownloadClient({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setdownloadClient(data);
                }
            },
            onError: error => message.error(error)
        });
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
                subheader={<ListSubheader>下载工具</ListSubheader>}
            >
                {downloadClient && downloadClient.map((item, index) => (
                    <ListItem key={index} divider>
                        <ListItemButton
                            onClick={() => navigate("/setting/edit-download-client?type=" + item.type + "&name=" + item.name)}>
                            <ListItemIcon>
                                {item.type === "qbittorrent" ?
                                    <SvgIcon fontSize="large" component={QbitIcon} viewBox="0 0 400 400"/> : null}
                                {item.type === "transmission" ?
                                    <SvgIcon fontSize="large" component={TransmissionIcon}
                                             viewBox="0 0 400 400"/> : null}
                            </ListItemIcon>
                            <ListItemText
                                primary={<TextLabel text={item.name} chipLabel={item.is_default ? "默认" : null}/>}/>
                            <HealthStatus status={item.status}/>
                            <ArrowForwardIosOutlinedIcon color="disabled"/>
                        </ListItemButton>
                    </ListItem>
                ))}
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

export default DownloadSettingList;