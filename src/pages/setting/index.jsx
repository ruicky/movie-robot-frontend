import {Helmet} from "react-helmet-async";
import React from "react";
import DownloadSettingList from "@/pages/setting/DownloadClient";
import MediaServerSettingList from "@/pages/setting/MediaServer";
import MovieMetadataSettingList from "@/pages/setting/MovieMetadata";

function Setting() {
    return (
        <>
            <Helmet title="设置"/>
            <MediaServerSettingList></MediaServerSettingList>
            <DownloadSettingList></DownloadSettingList>
            <MovieMetadataSettingList/>
        </>
    );
}

export default Setting;