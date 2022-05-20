import React from 'react';
import TVCard from "@/pages/movie/search/components/MediaCard/TVCard";
import MovieCard from "@/pages/movie/search/components/MediaCard/MovieCard";
import {Box, Button, Card, CardContent, CardMedia, Link, Skeleton, Typography} from "@mui/material";
import MediaTag from "@/pages/movie/search/components/MediaCard/MediaTag";
import Stream from "@/pages/movie/search/components/MediaCard/Stream";
import {Autorenew} from "@mui/icons-material";
import MediaView from "@/pages/movie/search/components/MediaCard/MediaView";


const MediaCard = ({media}) => {
    if (media) {
        if (media.type === 'Movie') {
            return (
                <MovieCard media={media}/>
            )
        } else {
            return (
                <TVCard media={media}/>
            )
        }
    } else {
        return (
            <Card>
                <Box sx={{display: 'flex', flexDirection: 'column'}}>
                    <CardContent sx={{flex: '1 0 auto'}}>
                        <Typography component="div" variant="h5">
                            <Skeleton/>
                        </Typography>
                        <Skeleton height={20} width={80}/>
                        <Skeleton height={20} width={80}/>
                        <Skeleton/>
                        <Skeleton/>
                    </CardContent>
                </Box>
            </Card>
        );
    }
}

export default MediaCard;