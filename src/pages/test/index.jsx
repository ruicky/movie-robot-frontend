import React from 'react'
import './index.css'
import {CardButton} from "@/components/CardButton";
import AcUnitIcon from '@mui/icons-material/AcUnit';
import {Grid} from "@mui/material";

// 随机生成颜色
function randomColor() {
    return '#' + Math.floor(Math.random() * 0xffffff).toString(16).padEnd(6, '0')
}

function index() {
    return (
        <Grid spacing={3} container>
            {Array.from(new Array(10).keys()).map((index) => {
                return <Grid key={index} xs={6} sm={4} md={3} lg={2} item>
                    <CardButton color={randomColor()} icon={<AcUnitIcon fontSize="large"/>} label={"功能"}
                                helper={"描述"}/>
                </Grid>
            })}
        </Grid>
    );
}

export default index