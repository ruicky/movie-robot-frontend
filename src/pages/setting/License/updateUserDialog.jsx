import DialogTitle from "@mui/material/DialogTitle";
import {Button, Dialog, DialogActions, DialogContent, Grid, TextField} from "@mui/material";
import * as React from "react";
import {useEffect} from "react";
import {useSmartForm} from "@/components/SmartForm";
import {useUpdateRemoteNickname} from "@/api/UserApi";
import message from "@/utils/message";

export const UpdateUserDialog = ({user, open, handleClose,handleSuccess}) => {
    const {mutate: updateNickname} = useUpdateRemoteNickname();
    const smartForm = useSmartForm({
        initValues: {
            nickname: ''
        }
    });
    useEffect(() => {
        if (!user) {
            return;
        }
        smartForm.setFieldValue('nickname', user.nickname)
    }, [user]);
    const onSubmit = () => {
        updateNickname({nickname: smartForm.values.nickname}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    message.success(msg);
                    handleClose();
                    if (handleSuccess) {
                        handleSuccess(smartForm.values.nickname);
                    }
                } else {
                    message.error(msg);
                }
            }
        })
    }
    return (<Dialog maxWidth={"xs"} open={open} fullWidth>
        <DialogTitle>
            修改昵称
        </DialogTitle>
        <DialogContent>
            <Grid spacing={4} sx={{mt: 1}} container>
                <Grid item xs={12}>
                    <TextField
                        type="text"
                        name="nickname"
                        label="昵称"
                        helperText={"展示给产品其他用户的昵称，分享等功能"}
                        fullWidth
                        my={3}
                        value={smartForm.values.nickname}
                        onChange={smartForm.handleChange}
                    />
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={onSubmit}>保存</Button>
        </DialogActions>
    </Dialog>);
}