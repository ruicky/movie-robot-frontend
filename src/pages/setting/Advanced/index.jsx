import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import {ListItemButton, Switch} from "@mui/material";
import {useNavigate} from "react-router-dom";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import FilterListIcon from '@mui/icons-material/FilterList';
import ClosedCaptionIcon from "@mui/icons-material/ClosedCaption";
import {useGetSettingStatus, useSetFreeDownloadEnable, useSetSubtitleEnable} from "@/api/SettingApi";
import message from "@/utils/message";
import LanguageIcon from "@mui/icons-material/Language";
import SearchIcon from '@mui/icons-material/Search';

function AdvancedSettingList() {
    const navigate = useNavigate();
    const {data: settingStatus, isLoading: isLoading, refetch} = useGetSettingStatus();

    const {mutateAsync: setFreeDownloadEnable, isLoading: isSetFreeDownloadEnable} = useSetFreeDownloadEnable();
    const {mutateAsync: setSubtitleEnable, isLoading: isSetSubtitleEnable} = useSetSubtitleEnable();
    const onFreeDownloadEnableChange = (checked) => {
        setFreeDownloadEnable({enable: checked}, {
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
    const onSubtitleEnableChange = (checked) => {
        setSubtitleEnable({enable: checked}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success('更改配置成功，需要重启后才能生效。')
                    refetch();
                } else {
                    message.error(msg);
                }
            }
        })
    }
    return (
        <List
            sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
            subheader={<ListSubheader>进阶设置</ListSubheader>}
        >
            <ListItem divider>
                <ListItemButton onClick={() => navigate("/setting/edit-free-download")}>
                    <ListItemIcon>
                        <DataThresholdingIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="流量自动管理"/>
                    <Switch
                        edge="end"
                        checked={settingStatus && settingStatus?.data.free_download_enable}
                        onClick={e => e.stopPropagation()}
                        onChange={(e) => onFreeDownloadEnableChange(e.target.checked)}
                        inputProps={{
                            'aria-labelledby': 'switch-list-label-bluetooth',
                        }}
                    />
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem divider>
                <ListItemButton onClick={() => navigate("/setting/edit-subtitle")}>
                    <ListItemIcon>
                        <ClosedCaptionIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="字幕自动下载"/>
                    <Switch
                        edge="end"
                        checked={settingStatus && settingStatus?.data.subtitle_enable}
                        onClick={e => e.stopPropagation()}
                        onChange={(e) => onSubtitleEnableChange(e.target.checked)}
                        inputProps={{
                            'aria-labelledby': 'switch-list-label-bluetooth',
                        }}
                    />
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton onClick={() => navigate("/setting/edit-search-setting")}>
                    <ListItemIcon>
                        <SearchIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="网页搜索设置"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
            <ListItem>
                <ListItemButton onClick={() => navigate("/setting/edit-web")}>
                    <ListItemIcon>
                        <LanguageIcon fontSize={"large"}/>
                    </ListItemIcon>
                    <ListItemText primary="应用访问"/>
                    <ArrowForwardIosOutlinedIcon color="disabled"/>
                </ListItemButton>
            </ListItem>
        </List>
    );
}

export default AdvancedSettingList;