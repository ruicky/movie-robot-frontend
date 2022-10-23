import React from 'react';
import TVCard from "@/pages/movie/search/components/MediaCard/TVCard";
import MovieCard from "@/pages/movie/search/components/MediaCard/MovieCard";
import {Box, Card, CardContent, Skeleton, Typography} from "@mui/material";


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