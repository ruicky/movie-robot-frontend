import {Helmet} from "react-helmet-async";
import React from "react";
import DownloadSettingList from "@/pages/setting/DownloadClient";
import MediaServerSettingList from "@/pages/setting/MediaServer";
import MovieMetadataSettingList from "@/pages/setting/MovieMetadata";
import BaseSettingList from "@/pages/setting/Base";

function Setting() {
    return (
        <>
            <Helmet title="设置"/>
            <BaseSettingList/>
            <DownloadSettingList/>
            <MediaServerSettingList/>
            <MovieMetadataSettingList/>
        </>
    );
}

export default Setting;