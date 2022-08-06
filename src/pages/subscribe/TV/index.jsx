import React from "react";
import SubscribeList from "@/pages/subscribe/components/SubscribeList";
import {Helmet} from "react-helmet-async";
import {Typography} from "@mui/material";

const TVIndex = () => {
    return (
        <>
            <Helmet title="我订阅的剧集"/>
            <Typography variant="h3" gutterBottom>
                我订阅的剧集
            </Typography>
            <SubscribeList mediaType="TV"/>
        </>
    );
}
export default TVIndex;