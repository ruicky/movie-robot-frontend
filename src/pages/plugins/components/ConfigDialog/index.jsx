import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {PluginConfigForm} from "@/pages/plugins/components/PluginConfigForm";
import {useGetPluginsVersion, useSavePluginConfig} from "@/api/PluginApi";
import message from "@/utils/message";

export const ConfigDialog = ({
                                 open,
                                 pluginId,
                                 pluginName,
                                 version,
                                 handleClose,
                                 title,
                                 pluginConfigField,
    onSubmitSuccess
                             }) => {
    const {mutate: getVersion} = useGetPluginsVersion();
    const {mutate: saveConfig, isLoading: isSaving} = useSavePluginConfig();
    const [configField, setConfigField] = useState(null);
    const configFormRef = useRef(null);
    useEffect(() => {
        if (!pluginId || !version) {
            return;
        }
        getVersion({plugin_id: pluginId, version}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    setConfigField(data.configField)
                } else {
                    message.error(msg);
                }
            }
        });
    }, [pluginId, version])
    useEffect(()=>{
        if (pluginConfigField) {
            setConfigField(pluginConfigField);
        }
    },[pluginConfigField])
    const onSubmit = () => {
        const values = configFormRef.current.getValues();
        saveConfig({
            plugin_name: pluginName,
            config: values
        }, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    message.success(msg);
                    setConfigField(null);
                    if (onSubmitSuccess) {
                        onSubmitSuccess({
                            plugin_name: pluginName,
                            config: values
                        });
                    }
                    handleClose();
                } else {
                    message.error(msg);
                }
            }
        });
    }
    return (<Dialog
        open={open}
        size="sm"
        fullWidth
    >
        <DialogTitle id="alert-dialog-title">
            {title ? title : "插件设置"}
        </DialogTitle>
        <DialogContent>
            <Box sx={{mt: 2}}><PluginConfigForm
                formRef={configFormRef}
                fields={configField}/></Box>
        </DialogContent>
        <DialogActions>
            <Button onClick={() => {
                setConfigField(null);
                handleClose()
            }}>取消</Button>
            <Button onClick={onSubmit}>
                {isSaving ? "保存中" : "保存设置"}
            </Button>
        </DialogActions>
    </Dialog>);
}