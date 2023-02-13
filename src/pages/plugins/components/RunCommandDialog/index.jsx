import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {PluginConfigForm} from "@/pages/plugins/components/PluginConfigForm";
import {useGetPluginCommandMeta} from "@/api/PluginApi";
import message from "@/utils/message";

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
    const [fields, setFields] = useState();
    const {mutate: get, isLoading} = useGetPluginCommandMeta();
    useEffect(() => {
        if (pluginName && commandName) {
            get({
                plugin_name: pluginName,
                command_name: commandName
            }, {
                onSuccess: resData => {
                    const {code, message: msg, data} = resData;
                    if (code === 0 && data) {
                        setFields(data.arg_schema?.map((f) => {
                            return {
                                fieldName: f.name,
                                fieldType: f.arg_type,
                                label: f.label,
                                helperText: f.helper,
                                defaultValue: f.default_value,
                                required: f.required,
                                enumValues: f.enum_values,
                                multiValue:f.multi_value
                            }
                        }));
                    } else {
                        message.error(msg);
                    }
                }
            });
        }
    }, [commandName, pluginName])
    return (<Dialog
        open={open}
        size="sm"
        disabled={isLoading}
        fullWidth
    >
        <DialogTitle>
            {title ? title : "运行功能"}
        </DialogTitle>
        <DialogContent>
            <Box sx={{mt: 2}}><PluginConfigForm
                formRef={argsFormRef}
                fields={fields}/></Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} disabled={isRunning}>取消</Button>
            <Button disabled={isRunning}
                    onClick={() => onSubmit(pluginName, commandName, argsFormRef.current.getValues())}>
                {isRunning ? "运行中" : "运行"}
            </Button>
        </DialogActions>
    </Dialog>);
}