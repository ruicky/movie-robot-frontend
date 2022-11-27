import {Button, CardMedia, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from "@mui/material";
import React from "react";

export const DonateDialog = ({open,payImageUrl, handleClose}) => {
    return (<Dialog
        open={open}
        size="xs"
        fullWidth
    >
        <DialogTitle id="alert-dialog-title">
            打赏插件开发者
        </DialogTitle>
        <DialogContent>
            <Typography variant="subtitle1" gutterBottom>
                如果你觉得插件解决了你的问题，可以打赏插件开发者表示支持，谢谢！（打赏码为开发者私人，平台不参与任何分成）
            </Typography>
            <CardMedia
                component="img"
                image={payImageUrl}
                alt="打赏"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
        </DialogActions>
    </Dialog>)
}