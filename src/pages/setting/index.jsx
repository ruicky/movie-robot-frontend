import {Helmet} from "react-helmet-async";
import React, {useEffect, useState} from "react";
import DownloadClientSettingList from "@/pages/setting/DownloadClient";
import MediaServerSettingList from "@/pages/setting/MediaServer";
import MovieMetadataSettingList from "@/pages/setting/MovieMetadata";
import DownloadSettingList from "@/pages/setting/DownloadSetting";
import NotifySettingList from "@/pages/setting/Notify";
import AdvancedSettingList from "@/pages/setting/Advanced";
import {Box, Button} from "@mui/material";
import RestartAppDialog from "@/pages/setting/RestartAppDialog";
import {Alert} from "@mui/lab";
import {useGetHealth} from "@/api/HealthApi";
import message from "@/utils/message";
import HealthDataDialog from "@/pages/setting/Health/HealthDataDialog";

function Setting() {
    const [showHealthData, setShowHealthData] = useState(false);
    const {data: healthData, isLoading: healthIsLoading, refetch: refetchHealth} = useGetHealth()
    const [showRestartDialog, setShowRestartDialog] = useState(false);
    const [healthTip, setHealthTip] = useState(null);
    useEffect(() => {
        if (healthData) {
            if (healthData.code === 0) {
                setHealthTip({level: healthData.data?.level, message: healthData.message})
            } else {
                message.error('')
            }
        }
    }, [healthData])
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