import {Helmet} from "react-helmet-async";
import React, {useState} from "react";
import DownloadClientSettingList from "@/pages/setting/DownloadClient";
import MediaServerSettingList from "@/pages/setting/MediaServer";
import MovieMetadataSettingList from "@/pages/setting/MovieMetadata";
import DownloadSettingList from "@/pages/setting/DownloadSetting";
import NotifySettingList from "@/pages/setting/Notify";
import AdvancedSettingList from "@/pages/setting/Advanced";
import {Box, Button} from "@mui/material";
import RestartAppDialog from "@/pages/setting/RestartAppDialog";

function Setting() {
    const [showRestartDialog, setShowRestartDialog] = useState(false);
    return (
        <>
            <Helmet title="设置"/>
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