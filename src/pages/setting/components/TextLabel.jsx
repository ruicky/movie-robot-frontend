import {Chip} from "@mui/material";
import * as React from "react";

export const TextLabel = ({text, chipLabel = null, chipColor = "success"}) => {
    return (
        <>
            {text}
            {chipLabel ?
                <Chip label={chipLabel} size="small" color={chipColor} style={{borderRadius: 50}} sx={{ml: 2}}/> : null}
        </>
    );
}