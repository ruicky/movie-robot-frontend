import React, {useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
} from '@mui/material';
import {useDeleteSubscribe} from '@/utils/subscribe';
import message from "@/utils/message";
import SeasonSelect from "@/pages/subscribe/components/SeasonSelect";


const DeleteConfrimDialog = ({open, handleClose, data, onComplete}) => {
    const {name, year} = data;
    const {mutate: deleteSubscribe, isLoading} = useDeleteSubscribe();
    const [deepDelete, setDeepDelete] = useState(true)
    const [seasonDoubanId, setSeasonDoubanId] = useState(data?.season && data.season.length > 0 ? data.season.map(x => x.doubanId) : []);

    let id;
    if (data.sub_id) {
        id = data.sub_id;
    } else {
        id = data.id;
    }
    const handleSubmit = async () => {
        deleteSubscribe({id, deep_delete: deepDelete, season_ids: seasonDoubanId}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    message.success(`${name}已经取消订阅。`);
                    if (onComplete) {
                        onComplete(null);
                    }
                    handleClose();
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {'删除提示'}
            </DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    确定要取消 {name}{year ? "(" + year + ")" : ""} 的订阅吗？
                </DialogContentText>
                <Grid>
                    <Grid item>
                        {data?.season && data?.season.length > 0 &&
                        <SeasonSelect text={"取消所有选中季的订阅"} items={data?.season} seasonDoubanId={seasonDoubanId}
                                      setSeasonDoubanId={setSeasonDoubanId}/>}
                    </Grid>
                    <Grid item>
                        <FormControlLabel
                            control={<Checkbox
                                checked={deepDelete}
                                name="deepDelete"
                                onChange={(e) => setDeepDelete(e.target.checked)}
                            />}
                            label="深度删除（所有下载记录、源种子、媒体服务器资源及链接后文件）"
                        />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose}>取消</Button>
                <Button onClick={handleSubmit} autoFocus disabled={isLoading}>
                    确定
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteConfrimDialog;