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
import axios from "../../utils/request";


const SetSite = ({opType, open, site, siteMeta, filterSiteNames, onClose, onEditSuccess, onEditFailed}) => {
    const [values, setValues] = React.useState({
        site_name: "mteam", cookie: "", web_search: true, smart_download: true
    });
    const [siteData, setSiteData] = useState(siteMeta)
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
        if (values.site_name === undefined || values.site_name === "") {
            setErrorMessage("必须选择站点");
            hasError = true;
        } else {
            setErrorMessage(undefined);
        }
        if (values.cookie === undefined || values.cookie === "") {
            setErrors({...errors, cookie: "必须填写Cookie"});
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
            setMessage('保存中，请稍后....')
            const res = await axios.post("/api/site/save_site", values);
            const {code, message, data} = res;
            if (code === undefined || code === 1) {
                setErrorMessage(message);
                return;
            }
            onEditSuccess(opType, values)
        } catch (error) {
            const message = error.message || "配置出错啦";
            setErrorMessage(message);
            if (onEditFailed !== undefined) {
                onEditFailed(error, opType, values)
            }
        } finally {
            setMessage(undefined)
            setSubmitting(false)
        }
    }
    useEffect(() => {
        setErrors({});
        setShowErrors({});
        setErrorMessage(undefined)
        if (opType === "add" && filterSiteNames !== undefined && filterSiteNames.length > 0) {
            let data = []
            siteMeta.map((val, i) => {
                if (!filterSiteNames.includes(val.id)) {
                    data.push(val)
                }
            })
            setSiteData(data)
            setValues({...values, site_name: data[0].id})
        } else {
            setSiteData(siteMeta)
        }
        if (site !== undefined && site !== null) {
            setValues({
                site_name: site.site_name,
                cookie: site.cookie,
                web_search: site.web_search === 1,
                smart_download: site.smart_download === 1
            })
        } else {
            setValues({
                site_name: "", cookie: "", web_search: true, smart_download: true
            })
        }
    }, [opType, site, filterSiteNames])
    return (<Dialog
        open={open}
        onClose={!submitting ? onClose : null}
        aria-labelledby="form-dialog-title"
    >
        <DialogTitle id="form-dialog-title">{opType === "add" ? "新增站点" : "编辑站点"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                站点将用于搜索和智能下载任务。
            </DialogContentText>
            {errorMessage && (<Alert mt={2} mb={1} severity="warning">
                {errorMessage}
            </Alert>)}
            {message && (<Alert severity="info" my={3}>
                {message}
            </Alert>)}
            <FormControl fullWidth>
                <Select
                    name="site_name"
                    value={values.site_name}
                    onChange={(e) => handleValueChange(e)}
                    disabled={opType === "update"}
                >
                    {siteData && siteData.map((row) => (
                        <MenuItem key={row.id} value={row.id}>{row.name + '-' + row.domain}</MenuItem>))}
                </Select>
                <FormHelperText>路径存放的内容类型</FormHelperText>
            </FormControl>
            <TextField
                type="text"
                name="cookie"
                margin="dense"
                label="Cookie"
                fullWidth
                defaultValue={values.cookie}
                onChange={handleValueChange}
                error={Boolean(showErrors.cookie && errors.cookie)}
                helperText={(showErrors.cookie && errors.cookie) || (
                    <span>
                        使站点保持登陆状态的有效Cookie
                        <Link target="_blank"
                              href="https://support.huaweicloud.com/vss_faq/vss_01_0146.html">
                                去学习如何获取
                            </Link>
                    </span>
                )}
            />
            <FormControlLabel
                control={<Checkbox
                    checked={values.web_search}
                    name="web_search"
                    onChange={handleValueChange}
                />}
                label="允许在Web搜索中使用"
            />
            <FormControlLabel
                control={<Checkbox
                    checked={values.smart_download}
                    name="smart_download"
                    onChange={handleValueChange}
                />}
                label="允许在智能下载中使用"
            />
        </DialogContent>
        <DialogActions>
            <Button color="primary" onClick={() => onSubmit(values)} disabled={submitting}>
                提交
            </Button>
            <Button onClick={onClose} color="primary" disabled={submitting}>
                取消
            </Button>
        </DialogActions>
    </Dialog>);
}
export default SetSite