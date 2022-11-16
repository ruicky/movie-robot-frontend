import DialogTitle from "@mui/material/DialogTitle";
import {Button, Dialog, DialogActions, DialogContent, FormHelperText, Grid, IconButton, TextField} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import * as React from "react";
import {useState} from "react";

export const ImportRuleDialog = ({open, handleClose, handleSubmit}) => {
    const [ruleString, setRuleString] = useState('');
    return (<Dialog maxWidth={"sm"} open={open} onClose={handleClose} fullWidth>
        <DialogTitle>
            导入规则
            <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon/>
            </IconButton>
        </DialogTitle>
        <DialogContent>
            <Grid spacing={2} sx={{mt: 1}} container>
                <Grid item xs={12}>
                    <TextField
                        label="私密规则"
                        multiline
                        rows={8}
                        variant="filled"
                        value={ruleString}
                        onChange={(e) => setRuleString(e.target.value)}
                        fullWidth
                    />
                    <FormHelperText>复制别人分享给你的私密规则直接导入</FormHelperText>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={()=>handleSubmit(ruleString)}>
                导入
            </Button>
        </DialogActions>
    </Dialog>);
}