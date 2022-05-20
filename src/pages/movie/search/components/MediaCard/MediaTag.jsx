import {Stack} from "@mui/material";
import MetaTag from "@/pages/movie/search/components/MetaTag";
import React from "react";

const MediaTag = ({video_resolution, video_codec, video_container}) => {
    return (
        <Stack direction="row" spacing={1} mt={2}>
            <MetaTag label={video_resolution} color="success"/>
            <MetaTag label={video_codec} color="info"/>
            <MetaTag label={video_container} color="primary"/>
        </Stack>
    )
}
export default MediaTag;