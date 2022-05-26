import {Helmet} from "react-helmet-async";
import React from "react";
import DownloadClientSettingList from "@/pages/setting/DownloadClient";
import MediaServerSettingList from "@/pages/setting/MediaServer";
import MovieMetadataSettingList from "@/pages/setting/MovieMetadata";
import DownloadSettingList from "@/pages/setting/DownloadSetting";
import NotifySettingList from "@/pages/setting/Notify";
import AdvancedSettingList from "@/pages/setting/Advanced";

function Setting() {
    return (
        <>
            <Helmet title="设置"/>
            <MediaServerSettingList/>
            <DownloadClientSettingList/>
            <MovieMetadataSettingList/>
            <NotifySettingList/>
            <DownloadSettingList/>
            <AdvancedSettingList/>
        </>
    );
}

export default Setting;