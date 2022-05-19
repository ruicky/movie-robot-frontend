import React from 'react';
import TVCard from "@/pages/movie/search/components/MediaCard/TVCard";
import MovieCard from "@/pages/movie/search/components/MediaCard/MovieCard";
import {Box, Button, Card, CardContent, CardMedia, Link, Skeleton, Typography} from "@mui/material";
import MediaTag from "@/pages/movie/search/components/MediaCard/MediaTag";
import Stream from "@/pages/movie/search/components/MediaCard/Stream";
import {Autorenew} from "@mui/icons-material";


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
            <Skeleton/>
        );
    }
}

export default MediaCard;