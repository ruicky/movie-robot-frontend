import {Button, Stack} from "@mui/material";
import React from "react";

export const FormActions = ({handleClose, handleSave}) => {
    return (
        <Stack direction="row" spacing={2} justifyContent={"right"}>
            <Button
                mr={2}
                size="small"
                color="secondary"
                onClick={handleClose}
            >
                取消
            </Button>
            <Button
                mr={2}
                size="small"
                onClick={handleSave}
            >
                保存
            </Button>
        </Stack>);
}