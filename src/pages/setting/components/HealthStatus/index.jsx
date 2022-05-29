import {Chip} from "@mui/material";
import * as React from "react";

function HealthStatus({status}) {
    if (status === 0) {
        return <Chip sx={{mr: 2}} size="small" label="未设置" color="primary"/>;
    } else if (status === 1) {
        return <Chip sx={{mr: 2}} size="small" label="可用" color="success"/>;
    } else if (status === 2) {
        return <Chip sx={{mr: 2}} size="small" label="异常" color="error"/>;
    } else {
        return <Chip sx={{mr: 2}} size="small" label="未知" color="info"/>;
    }
}

export default HealthStatus;