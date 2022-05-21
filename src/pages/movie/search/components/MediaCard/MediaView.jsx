import React from "react";
import {Card} from "@mui/material";
import styled from "styled-components/macro";


const MediaView = (props) => (
    <Card sx={{
        background: `linear-gradient(77deg,rgba(0,0,0,.91) 0,rgba(0,0,0,.65) 50%,rgba(0,0,0,.45) 100%), url(${props.image})`,
        display: 'flex',
        backgroundSize: "cover",
        backgroundPosition: "center",
        color: '#fff !important',
    }}>
        {props.children}
    </Card>
);


export default MediaView;