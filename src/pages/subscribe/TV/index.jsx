import React from "react";
import SubscribeList from "@/pages/subscribe/components/SubscribeList";
import {Helmet} from "react-helmet-async";
import {Typography} from "@mui/material";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";

const TVIndex = () => {
    return (
        <>
            <Helmet title="我订阅的剧集"/>
            <Typography variant="h3" gutterBottom>
                我订阅的剧集
            </Typography>
            <FilterOptionsProvider>
                <SubscribeList mediaType="TV"/>
            </FilterOptionsProvider>
        </>
    );
}
export default TVIndex;