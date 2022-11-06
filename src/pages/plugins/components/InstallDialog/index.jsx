import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    MenuItem,
    Select
} from "@mui/material";
import React, {useEffect, useRef, useState} from "react";
import {useSmartForm} from "@/components/SmartForm";
import {ChangeLogItem} from "@/pages/plugins/components/Changelog/Item";
import {PluginConfigForm} from "@/pages/plugins/components/PluginConfigForm";
import {useGetPluginConfig} from "@/api/PluginApi";

export const InstallDialog = ({
                                  open,
                                  pluginId,
                                  pluginName,
                                  versionList,
                                  handleClose,
                                  handleSubmit,
                                  submitting,
                                  title,
                                  installed
                              }) => {
    const {data: configRes} = useGetPluginConfig(pluginName);
    const [version, setVersion] = useState(null);
    const [configField, setConfigField] = useState(null);
    const configFormRef = useRef(null);
    const smartForm = useSmartForm({
        initValues: {
            version: '',
            autoRestart: true
        }
    });
    useEffect(() => {
        if (!smartForm.values.version) {
            return;
        }
        const version = versionList.find(x => x.version === smartForm.values.version);
        if (!version) {
            return;
        }
        if (version.configField) {
            const configField = JSON.parse(version.configField);
            if (configRes?.data) {
                //将读到的现存配置信息作为配置展示的默认值
                Object.keys(configRes.data).map((key) => {
                    let f = configField.find(x => x.fieldName === key);
                    f.defaultValue = configRes.data[key];
                })
            }
            setConfigField(configField);
        }
        setVersion(version);
    }, [smartForm.values.version, configRes])
    useEffect(() => {
        if (versionList && versionList.length > 0) {
            smartForm.setFieldValue("version", versionList[0].version);
        }
    }, [versionList])
    return (<Dialog
        open={open}
        size="sm"
        fullWidth
    >
        <DialogTitle id="alert-dialog-title">
            {title ? title : "安装插件"}
        </DialogTitle>
        <DialogContent>
            <Grid spacing={4} sx={{mt: 1}} container>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <Select
                            name="version"
                            value={smartForm.values.version}
                            onChange={smartForm.handleChange}
                            fullWidth
                        >
                            {versionList && versionList.map((item, index) => <MenuItem key={index}
                                                                                       value={item.version}>v{item.version}</MenuItem>)}
                        </Select>
                        <FormHelperText>选择需要安装的版本</FormHelperText>
                    </FormControl>
                </Grid>
                {version && <Grid item xs={12}>
                    <ChangeLogItem version={version.version} body={version.changelog} publishDate={version.gmtCreate}/>
                </Grid>}
                {configField && <Grid xs={12} item>
                    <PluginConfigForm
                        formRef={configFormRef}
                        title={"插件配置"}
                        fields={configField}/>
                </Grid>}
                {installed && <Grid xs={12} item>
                    <FormControlLabel
                        control={<Checkbox
                            name="autoRestart"
                            checked={smartForm.values.autoRestart}
                            onChange={smartForm.handleChange}
                        />}
                        label="安装完成立即自动重启"
                    />
                </Grid>}
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={() => handleSubmit(pluginId, smartForm.values, configFormRef.current.getValues())}
                    disabled={Boolean(submitting)}>
                {submitting ? installed ? "升级中" : "安装中" : installed ? "升级" : "安装"}
            </Button>
        </DialogActions>
    </Dialog>);
}