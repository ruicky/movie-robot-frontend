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
import {ReactComponent as Aria2Icon} from "@/pages/setting/Icon/aria2.svg";
import {Add as AddIcon} from "@mui/icons-material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import {useGetDownloadClient} from "@/api/SettingApi";
import message from "@/utils/message";
import HealthStatus from "@/pages/setting/components/HealthStatus";
import SelectDialog from "@/pages/setting/DownloadClient/SelectDialog";
import axios from "@/utils/request";
import {TextLabel} from "@/pages/setting/components/TextLabel";



function DownloadSettingList() {
    const navigate = useNavigate();
    const [siteMeta, setSiteMeta] = useState([]);
    const [showSelect, setShowSelect] = useState(false);
    const [downloadClient, setdownloadClient] = useState([]);
    const {mutateAsync: getDownloadClient, isLoading} = useGetDownloadClient();
    useEffect(async () => {
        let res = await axios.get('/api/common/sites')
        setSiteMeta(res.data);
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
                subheader={
                    <ListSubheader>{downloadClient && downloadClient.length > 0 ? "下载工具" : "下载工具(必须配置)"}</ListSubheader>}
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
                                {item.type === "aria2" ?
                                    <SvgIcon fontSize="large" component={Aria2Icon}
                                             viewBox="0 0 400 400"/> : null}
                            </ListItemIcon>
                            <ListItemText
                                primary={<TextLabel text={item.name} chipLabel={item.is_default ? "默认" : null}/>}
                                secondary={item.site_id ? item.site_id.map((value) => {
                                    return siteMeta && (siteMeta.find(item => item.id === value) | {name: ''}).name
                                }).join(" / ") : "所有站点"}
                            />
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