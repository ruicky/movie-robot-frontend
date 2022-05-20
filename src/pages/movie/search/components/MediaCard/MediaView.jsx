import {Card} from "@mui/material";
import React from "react";

const MediaView = (props) => (
    <Card sx={{
        display: 'flex',
        // opacity: 0.4,
        // backgroundSize: "cover",
        // backgroundPosition: "center",
        // backgroundImage: `url(${props.image})`,
    }}>
        {props.children}
    </Card>
);
export default MediaView;