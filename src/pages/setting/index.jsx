import {Helmet} from "react-helmet-async";
import React, {useEffect, useState} from "react";
import DownloadClientSettingList from "@/pages/setting/DownloadClient";
import MediaServerSettingList from "@/pages/setting/MediaServer";
import MovieMetadataSettingList from "@/pages/setting/MovieMetadata";
import DownloadSettingList from "@/pages/setting/DownloadSetting";
import NotifySettingList from "@/pages/setting/Notify";
import AdvancedSettingList from "@/pages/setting/Advanced";
import {Avatar, Box, Button, ListItemButton} from "@mui/material";
import RestartAppDialog from "@/pages/setting/RestartAppDialog";
import Alert from '@mui/material/Alert';
import {useGetHealth} from "@/api/HealthApi";
import message from "@/utils/message";
import HealthDataDialog from "@/pages/setting/Health/HealthDataDialog";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
import List from "@mui/material/List";
import {useNavigate} from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import {useGetLicenseDetail} from "@/api/AuthApi";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ArticleIcon from '@mui/icons-material/Article';
function Setting() {
    const {user} = useAuth();
    const navigate = useNavigate();
    const [showHealthData, setShowHealthData] = useState(false);
    const {data: healthData, isLoading: healthIsLoading, refetch: refetchHealth} = useGetHealth();
    const {data: licenseDetail} = useGetLicenseDetail();
    const [remoteUser, setRemoteUser] = useState(null);
    const [showRestartDialog, setShowRestartDialog] = useState(false);
    const [healthTip, setHealthTip] = useState(null);
    const [licenseMessage, setLicenseMessage] = useState(null);
    useEffect(() => {
        if (healthData) {
            if (healthData.code === 0) {
                setHealthTip({level: healthData.data?.level, message: healthData.message})
            } else {
                message.error('')
            }
        }
    }, [healthData])
    useEffect(() => {
        if (!licenseDetail?.data) {
            return;
        }
        const {
            licenseType,
            expireDays,
            user
        } = licenseDetail?.data;
        setRemoteUser(user);
        if (licenseType === 'VIP') {
            setLicenseMessage('尊贵的永久授权用户！❤️🌹');
        } else if (licenseType === 'SubVIP') {
            setLicenseMessage(`订阅授权还有${expireDays}天过期🌹`);
        } else if (licenseType === 'ExperienceUser') {
            setLicenseMessage(`体验授权还有${expireDays}天过期。`);
        }
    }, [licenseDetail])
    return (
        <>
            <Helmet title="设置"/>
            <HealthDataDialog open={showHealthData} handleClose={() => setShowHealthData(false)}/>
            {healthTip && <Alert
                variant="filled" severity={healthTip?.level} sx={{mb: 4}} style={{cursor: 'pointer'}}
                onClick={() => setShowHealthData(true)}
                action={
                    <Button color="inherit" size="small" onClick={(e) => {
                        e.stopPropagation();
                        refetchHealth();
                    }}>
                        刷新
                    </Button>
                }
            >
                {healthTip?.message}
            </Alert>}
            <List
                sx={{width: '100%', maxWidth: '100%', bgcolor: 'background.paper', mb: 4}}
            >
                <ListItem>
                    <ListItemButton onClick={() => navigate("/setting/license")}>
                        <ListItemIcon>
                            {user && <Avatar alt={user.nickname}
                                             src={user.avatar}>{user.nickname && user.nickname.substring(0, 1)}</Avatar>}
                        </ListItemIcon>
                        <ListItemText primary={remoteUser?.nickname} secondary={licenseMessage}/>
                        <ArrowForwardIosOutlinedIcon color="disabled"/>
                    </ListItemButton>
                </ListItem>
            </List>
            <MediaServerSettingList/>
            <DownloadClientSettingList/>
            <MovieMetadataSettingList/>
            <NotifySettingList/>
            <DownloadSettingList/>
            <AdvancedSettingList/>
            <RestartAppDialog open={showRestartDialog} handleClose={() => {
                setShowRestartDialog(false);
            }}/>
            <Box>
                <Button
                    mr={2}
                    size="medium"
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => setShowRestartDialog(true)}
                >
                    重启应用
                </Button>
            </Box>
        </>
    );
}

export default Setting;