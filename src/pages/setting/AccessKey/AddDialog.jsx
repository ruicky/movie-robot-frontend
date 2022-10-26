import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select
} from "@mui/material";
import React, {useState} from "react";
import {useGetUserList} from "@/api/UserApi";

export const AddDialog = ({open, handleClose, handleSubmit, submitting}) => {
    const {data: userList} = useGetUserList();
    const [bindUid, setBindUid] = useState(0);
    return <Dialog
        open={open}
        onClose={handleClose}
    >
        <DialogTitle id="alert-dialog-title">
            新建API密钥
        </DialogTitle>
        <DialogContent>
            <Grid spacing={4} sx={{mt: 1}} container>
                <Grid item xs={12}>
                    <FormControl fullWidth>
                        <Select
                            name="bindUid"
                            value={bindUid}
                            onChange={(e) => setBindUid(e.target.value)}
                            fullWidth
                        >
                            {userList?.data && userList.data.map((user) => <MenuItem key={user.id}
                                                                                     value={user.id}>{user.nickname}</MenuItem>)}
                        </Select>
                        <FormHelperText>以什么身份使用这个密钥</FormHelperText>
                    </FormControl>
                </Grid>
            </Grid>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={() => handleSubmit(bindUid)} disabled={Boolean(submitting)}>
                {submitting ? "处理中" : "创建"}
            </Button>
        </DialogActions>
    </Dialog>;
}