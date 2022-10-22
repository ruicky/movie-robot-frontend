import React, {useEffect} from "react";
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControl,
    MenuItem,
    Select,
    TextField,
    Typography
} from "@mui/material";

const CorrectDialog = ({data, setData, onSubmit}) => {
    const [values, setValues] = React.useState({
        path: null,
        mediaType: "Movie",
        tmdbId: null,
        name: "",
        year: "",
        seasonIndex: null
    });
    const [errors, setErrors] = React.useState({});
    const [showErrors, setShowErrors] = React.useState({});
    const handleValueChange = (e) => {
        if (e.target.type === "checkbox") {
            setValues({...values, [e.target.name]: e.target.checked});
        } else {
            setValues({...values, [e.target.name]: e.target.value});
        }
        if (e.target.name === "tmdbId" && e.target.value && e.target.value.indexOf("themoviedb.org") !== -1) {
            if (e.target.value.indexOf("/movie/") !== -1) {
                setValues({...values, mediaType: "Movie", tmdbId: e.target.value})
            } else {
                setValues({...values, mediaType: "TV", tmdbId: e.target.value})
            }
        }
    };
    const onReAnalyze = (values) => {
        let hasError = false;
        if (!values.tmdbId) {
            if (values.name === undefined || values.name === "") {
                setErrors({...errors, name: "必须填写影视名称"});
                setShowErrors({...errors, name: true});
                hasError = true;
            }
            if (values.year === undefined || values.year === "") {
                setErrors({...errors, year: "必须填写发行年份"});
                setShowErrors({...errors, year: true});
                hasError = true;
            }
        }
        if (hasError) {
            return;
        } else {
            setErrors({});
            setShowErrors({});
        }
        if (onSubmit) {
            onSubmit(values);
        }
    };
    const handleClose = () => {
        if (setData) {
            setData({open: false});
        }
        setErrors({});
        setShowErrors({});
    };
    useEffect(() => {
        setValues(values => ({
            ...values,
            tmdbId: data?.tmdbId,
            seasonIndex: data?.seasonIndex,
            mediaType: data?.mediaType,
            path: data?.path,
            name: data?.name ? data.name : "",
            year: data?.year ? data.year : ""
        }));
    }, [data]);
    return (<Dialog
        open={data.open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
    >
        <DialogTitle id="form-dialog-title">手动输入信息进行整理</DialogTitle>
        <DialogContent>
            <DialogContentText>
                {data && data?.path && data.path.length > 1 && <Typography variant="h6">
                    注意：你选种了多个要处理的内容，这些内容都将会使用你提供的信息进行整理。
                </Typography>}
            </DialogContentText>
            <FormControl fullWidth>
                <Select
                    name="mediaType"
                    value={values.mediaType}
                    onChange={handleValueChange}
                >
                    <MenuItem value="Movie">电影</MenuItem>
                    <MenuItem value="TV">剧集</MenuItem>
                </Select>
            </FormControl>
            {values?.mediaType && values.mediaType === "TV" && <TextField
                type="number"
                name="seasonIndex"
                margin="dense"
                label="季度数"
                error={Boolean(showErrors.seasonIndex && errors.seasonIndex)}
                helperText={showErrors.seasonIndex && errors.seasonIndex}
                fullWidth
                defaultValue={values.seasonIndex}
                onChange={handleValueChange}
            />}
            <TextField
                type="text"
                name="tmdbId"
                margin="dense"
                label="TMDBID或访问地址"
                error={Boolean(showErrors.tmdbId && errors.tmdbId)}
                helperText={showErrors.tmdbId && errors.tmdbId}
                fullWidth
                defaultValue={values.tmdbId}
                onChange={handleValueChange}
            />
            <TextField
                type="text"
                name="name"
                margin="dense"
                label="影视名称"
                error={Boolean(showErrors.name && errors.name)}
                helperText={showErrors.name && errors.name}
                fullWidth
                defaultValue={values.name}
                onChange={handleValueChange}
            />
            <TextField
                type="text"
                name="year"
                margin="dense"
                label="发行年份"
                fullWidth
                defaultValue={values.year}
                onChange={handleValueChange}
                error={Boolean(showErrors.year && errors.year)}
                helperText={showErrors.year && errors.year}
            />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={() => onReAnalyze(values)}>
                提交
            </Button>
            <Button onClick={handleClose} color="primary">
                取消
            </Button>
        </DialogActions>
    </Dialog>);
};

export default CorrectDialog;
