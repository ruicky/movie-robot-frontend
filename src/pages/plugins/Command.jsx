import {Grid} from "@mui/material";
import {CardButton} from "@/components/CardButton";
import React from "react";

function randomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')
}

export const Command = () => {
    return <Grid spacing={3} container>
        {Array.from(new Array(10).keys()).map((index) => {
            return <Grid key={index} xs={6} sm={4} md={3} lg={2} item>
                <CardButton color={randomColor()} icon="AcUnit" label={"功能"}
                            helper={"描述"}/>
            </Grid>
        })}
    </Grid>
}