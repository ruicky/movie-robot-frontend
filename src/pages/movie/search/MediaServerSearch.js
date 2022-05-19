import {Grid} from "@mui/material";
import MediaCard from "@/pages/movie/search/components/MediaCard";
import React from "react";
import {useMediaSearch} from "@/api/MediaServerApi";

function MediaServerSearch({keyword}) {
    const {data, isLoading} = useMediaSearch({keyword});
    if (isLoading) {
        return (
            <Grid container spacing={4} my={4}>
                {Array.from(new Array(1)).map((item,index) => (
                    <Grid key={index} item xs={12} lg={12} xl={12}>
                        <MediaCard media={item}/>
                    </Grid>
                ))}
            </Grid>
        )
    } else {
        if (data && data.data) {
            return (
                <Grid container spacing={4} my={4}>
                    {data.data.map((item) => (
                        <Grid key={item.id} item xs={12} lg={12} xl={12}>
                            <MediaCard media={item}/>
                        </Grid>
                    ))}
                </Grid>
            )
        } else {
            return null;
        }
    }
}

export default MediaServerSearch;