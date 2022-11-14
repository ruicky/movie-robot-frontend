import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, {useRef} from "react";
import {PluginConfigForm} from "@/pages/plugins/components/PluginConfigForm";

export const RunCommandDialog = ({
                                     open,
                                     commandName,
                                     pluginName,
                                     handleClose,
                                     title,
                                     argsSchema,
                                     isRunning,
                                     onSubmit
                                 }) => {
    const argsFormRef = useRef(null);
    return (<Dialog
        open={open}
        size="sm"
        fullWidth
    >
        <DialogTitle>
            {title ? title : "运行功能"}
        </DialogTitle>
        <DialogContent>
            <Box sx={{mt: 2}}><PluginConfigForm
                formRef={argsFormRef}
                fields={argsSchema}/></Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} disabled={isRunning}>取消</Button>
            <Button disabled={isRunning} onClick={() => onSubmit(pluginName, commandName, argsFormRef.current.getValues())}>
                {isRunning ? "运行中" : "运行"}
            </Button>
        </DialogActions>
    </Dialog>);
}