import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControlLabel,
    Grid
} from "@mui/material";
import React from "react";
import {useSmartForm} from "@/components/SmartForm";

export const UnInstallDialog = ({open, handleClose, handleSubmit, submitting, title, pluginName}) => {
    const smartForm = useSmartForm({
        initValues: {
            deleteConfig: true
        }
    });
    return (<Dialog
        open={open}
        size="sm"
        fullWidth
    >
        <DialogTitle id="alert-dialog-title">
            {title ? title : "卸载插件"}
        </DialogTitle>
        <DialogContent>
            <Grid spacing={4} container>
                <Grid xs={12} item>
                    <FormControlLabel
                        control={<Checkbox
                            name="deleteConfig"
                            checked={smartForm.values.deleteConfig}
                            onChange={smartForm.handleChange}
                        />}
                        label="删除插件有关的配置文件"
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={() => handleSubmit(pluginName, smartForm.values)}
                    disabled={Boolean(submitting)}>
                {submitting ? "卸载中" : "确定卸载"}
            </Button>
        </DialogActions>
    </Dialog>);
}