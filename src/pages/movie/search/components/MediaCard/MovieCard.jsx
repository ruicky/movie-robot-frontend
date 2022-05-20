import {Box, Button, CardContent, CardMedia, Link, Typography} from "@mui/material";
import {Autorenew} from "@mui/icons-material";
import React from "react";
import MediaView from "@/pages/movie/search/components/MediaCard/MediaView";
import MediaTag from "@/pages/movie/search/components/MediaCard/MediaTag";
import Stream from "@/pages/movie/search/components/MediaCard/Stream";

const MovieCard = ({media}) => {
    return (
        <MediaView image={media.backdrop_url}>
            <CardMedia
                component="img"
                sx={{width: 151, borderRadius: '6px'}}
                image={media.poster_url}
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
                </CardContent>
            </Box>
        </MediaView>
    )
}
export default MovieCard;