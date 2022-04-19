import React, {useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import {reanalyze} from "@/api/DownloadApi";
import message from "@/utils/message";

export default function ReAnalyze(props) {
    const {
        id,
        open = false,
        movie_type,
        link_path,
        name: propsName,
        year: propsYear,
        notify: propsNotify = true,
        onAnalyze,
        onAnalyzeSuccess
    } = props;
    const [validResult, setValidResult] = useState({})
    const [name, setName] = useState();
    const [year, setYear] = useState();
    const [linkPath, setLinkPath] = useState();
    const [movieType, setMovieType] = useState();
    const [notify, setNotify] = useState(propsNotify);
    const [submitting, setSubmitting] = useState(false)
    useEffect(() => {
        setYear(propsYear)
    }, [propsYear])
    useEffect(() => {
        setName(propsName)
    }, [propsName])
    useEffect(() => {
        setLinkPath(link_path)
    }, [link_path])
    useEffect(() => {
        setMovieType(movie_type)
    }, [movie_type])
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
        if (!linkPath) {
            setValidResult({
                linkPath: {error: true, helperText: '必须填写链接目标路径'}
            })
            return;
        }
        setSubmitting(true)
        const result = await reanalyze({
            id,
            movie_type: movieType,
            link_path: linkPath,
            name,
            year,
            send_notify: notify ? 1 : 0
        });
        setSubmitting(false)
        handleClose();
        if (onAnalyzeSuccess && result.code === 0) {
            onAnalyzeSuccess(result)
            message.success(result.message || '操作成功')
        } else {
            message.error(result.message || '操作失败')
        }
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
                <FormControl m={4} fullWidth>
                    <Select
                        name="type"
                        value={movieType}
                        displayEmpty
                        onChange={(e) => setMovieType(e.target.value)}
                    >
                        <MenuItem value="Movie">电影</MenuItem>
                        <MenuItem value="Series">剧集</MenuItem>
                    </Select>
                    <FormHelperText>内容类型</FormHelperText>
                </FormControl>
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
                <TextField
                    type="text"
                    name="link_path"
                    margin="dense"
                    label="链接路径"
                    fullWidth
                    defaultValue={linkPath}
                    onChange={(e) => setLinkPath(e.target.value)}
                    error={!!validResult?.linkPath?.error}
                    helperText={validResult?.linkPath?.helperText}
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
                <Button color="primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "处理中..." : "提交"}
                </Button>
                <Button onClick={handleClose} color="primary" disabled={submitting}>
                    取消
                </Button>
            </DialogActions>
        </Dialog>);
}
