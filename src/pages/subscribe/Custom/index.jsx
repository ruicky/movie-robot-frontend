import {Helmet} from "react-helmet-async";
import {Divider, Typography} from "@mui/material";
import CustomList from "@/pages/subscribe/Custom/CustomList";
import React from "react";

const CustomIndex = () => {
    return (<>
        <Helmet title="自定义订阅"/>
        <Typography variant="h3" gutterBottom>
            自定义订阅
        </Typography>
        <Divider my={4}/>
        <CustomList/>
    </>)
}
export default CustomIndex;