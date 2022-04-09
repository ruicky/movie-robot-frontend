import React, {useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    TextField
} from "@mui/material";
import {reanalyze} from "@/utils/download_record";
import message from "@/utils/message";

export default function ReAnalyze(props) {
    const {
        id,
        open = false,
        name: propsName,
        year: propsYear,
        notify: propsNotify = true,
        onAnalyze,
        onAnalyzeSuccess
    } = props;
    const [validResult, setValidResult] = useState({})
    const [name, setName] = useState();
    const [year, setYear] = useState();
    const [notify, setNotify] = useState(propsNotify);

    useEffect(() => {
        setYear(propsYear)
    }, [propsYear])
    useEffect(() => {
        setName(propsName)
    }, [propsName])

    const handleClose = () => {
        onAnalyze({open: false})
    }

    const handleSubmit = async () => {
        // 验证
        if (!name) {
            setValidResult({
                name: {error: true, helperText: '必须填写影视名称'}
            })
            return;
        }
        if (!year) {
            setValidResult({
                year: {error: true, helperText: '必须填写发行年份'}
            })
            return;
        }
        const result = await reanalyze({
            id,
            name,
            year,
            send_notify: notify ? 1 : 0
        });
        handleClose();
        if (onAnalyzeSuccess) {
            onAnalyzeSuccess(result)
        }
        message.success(result.message || '操作成功')
    }
    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
        >
            <DialogTitle id="form-dialog-title">重新识别</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    提供正确的影视名称和年份，提交后，机器人将重新识别整理、通知。
                </DialogContentText>
                <TextField
                    autoFocus
                    type="text"
                    name="name"
                    margin="dense"
                    label="影视名称"
                    error={!!validResult?.name?.error}
                    helperText={validResult?.name?.helperText}
                    fullWidth
                    defaultValue={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextField
                    type="text"
                    name="year"
                    margin="dense"
                    label="发行年份"
                    fullWidth
                    defaultValue={year}
                    onChange={(e) => setYear(e.target.value)}
                    error={!!validResult?.year?.error}
                    helperText={validResult?.year?.helperText}
                />
                <FormControlLabel
                    control={<Checkbox
                        checked={notify}
                        name="notify"
                        onChange={(e) => setNotify(e.target.checked)}
                    />}
                    label="结束发推送"
                />
            </DialogContent>
            <DialogActions>
                <Button color="primary" onClick={handleSubmit}>
                    提交
                </Button>
                <Button onClick={handleClose} color="primary">
                    取消
                </Button>
            </DialogActions>
        </Dialog>);
}
