import {Box, CardContent, CardMedia, Link, Typography} from "@mui/material";
import React from "react";
import MediaView from "@/pages/movie/search/components/MediaCard/MediaView";
import MediaTag from "@/pages/movie/search/components/MediaCard/MediaTag";
import Stream from "@/pages/movie/search/components/MediaCard/Stream";
import styled from "styled-components/macro";
import DownloadSubtitleDialog from "@/pages/movie/search/components/MediaCard/DownloadSubtitleDialog";

const MovieCard = ({media}) => {
    return (
        <MediaView image={media.backdrop_url}>
            <CardMediaWrapper
                component="img"
                sx={{ borderRadius: '6px', cursor: 'pointer'}}
                image={media.poster_url}
                onClick={() => window.open(media.url)}
            />
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        <Link target="_blank" href={media.url}>{media.name}</Link>
                    </Typography>
                    <MediaTag video_codec={media.video_codec} video_resolution={media.video_resolution}
                               video_container={media.video_container}/>
                    <Stream title="音频" streams={media.audio_streams}/>
                    <Stream title="字幕" streams={media.subtitle_streams}/>
                    <Box>
                        <DownloadSubtitleDialog media_name={media.name} tmdb_id={media.tmdb_id}
                                                media_type="Movie"/>
                    </Box>
                </CardContent>
            </Box>
        </MediaView>
    )
}
const CardMediaWrapper = styled(CardMedia)`
    width: 0;
    color: #fff;
    ${(props) => props.theme.breakpoints.up("sm")} {
        width: 176px;
    }
`;
export default MovieCard;