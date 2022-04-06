import {
    Alert,
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
    Link,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "../../../utils/request";


const TestDownload = ({open, onClose, onSuccess, onFailed}) => {
    const [values, setValues] = React.useState({
        id: ""
    });
    const [errors, setErrors] = React.useState({});
    const [showErrors, setShowErrors] = React.useState({});
    const [submitting, setSubmitting] = useState(false)
    const [message, setMessage] = useState()
    const [errorMessage, setErrorMessage] = useState()
    const handleValueChange = (e) => {
        if (e.target.type === "checkbox") {
            setValues({...values, [e.target.name]: e.target.checked});
        } else {
            setValues({...values, [e.target.name]: e.target.value});
        }
    };
    const onSubmit = async (values) => {
        setSubmitting(true)
        let hasError = false;
        if (values.id === undefined || values.id === "") {
            setErrors({...errors, cookie: "必须填写豆瓣影视编号"});
            setShowErrors({...errors, cookie: true});
            hasError = true;
        }
        if (hasError) {
            setSubmitting(false)
            return;
        } else {
            setErrors({});
            setShowErrors({});
        }
        try {
            setErrorMessage(undefined)
            setMessage('测试中，请稍后....')
            const res = await axios.post("/api/config/test_douban_download", values);
            const {code, message, data} = res;
            if (code === undefined || code === 1) {
                setMessage(undefined)
                setErrorMessage(message);
                return;
            }
            setMessage(message)
            if (onSuccess !== undefined) {
                onSuccess(values)
            }
        } catch (error) {
            const message = error.message || "测试出错啦";
            setMessage(undefined)
            setErrorMessage(message);
            if (onFailed !== undefined) {
                onFailed(error, values)
            }
        } finally {
            setSubmitting(false)
        }
    }
    return (<Dialog
        open={open}
        onClose={!submitting ? () => {
            setMessage(undefined)
            setErrorMessage(undefined)
            setErrors({});
            setShowErrors({});
            setValues({id: ""})
            onClose()
        } : null}
        aria-labelledby="form-dialog-title"
    >
        <DialogTitle id="form-dialog-title">测试下载保存路径规则</DialogTitle>
        <DialogContent>
            <DialogContentText>
                找一部豆瓣上的电影或剧集，测试一下，会被保存在哪。（一定要先保存设置，再测试）
            </DialogContentText>
            {errorMessage && (<Alert mt={2} mb={1} severity="warning">
                {errorMessage}
            </Alert>)}
            {message && (<Alert severity="success" my={3}>
                {message}
            </Alert>)}

            <TextField
                type="text"
                name="id"
                margin="dense"
                label="豆瓣影视编号"
                fullWidth
                defaultValue={values.cookie}
                onChange={handleValueChange}
                error={Boolean(showErrors.cookie && errors.cookie)}
                helperText={(showErrors.cookie && errors.cookie) || (<span>
                        豆瓣的影视编号，一个数字。
                        <Link target="_blank"
                              href="https://movie.douban.com/">
                                去找一部测试
                            </Link>
                    </span>)}
            />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={() => onSubmit(values)} disabled={submitting}>
                测试
            </Button>
            <Button onClick={!submitting ? () => {
                setMessage(undefined)
                setErrorMessage(undefined)
                setErrors({});
                setShowErrors({});
                setValues({id: ""})
                onClose()
            } : null} color="primary" disabled={submitting}>
                取消
            </Button>
        </DialogActions>
    </Dialog>);
}
export default TestDownload