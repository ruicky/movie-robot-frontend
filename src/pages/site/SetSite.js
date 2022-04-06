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
        site_name: "mteam",
        cookie: "",
        web_search: true,
        smart_download: true,
        traffic_management_status: 0,
        upload_kpi: 1024
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
                smart_download: site.smart_download === 1,
                traffic_management_status: site.traffic_management_status,
                upload_kpi: site.upload_kpi
            })
        } else {
            setValues({
                site_name: "",
                cookie: "",
                web_search: true,
                smart_download: true,
                traffic_management_status: 0,
                upload_kpi: 1024
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
                <FormHelperText>当前已经支持的站点</FormHelperText>
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
            <FormControl fullWidth>
                <Select
                    name="traffic_management_status"
                    value={values.traffic_management_status}
                    onChange={(e) => handleValueChange(e)}
                >
                    <MenuItem value={0}>关闭流量管理</MenuItem>
                    <MenuItem value={1}>主动积累上传量</MenuItem>
                    <MenuItem value={2}>被动按需养护</MenuItem>
                </Select>
                <FormHelperText>
                    开启此功能还需要在基础设置-流量管理中做好设置才会生效。
                    <Link target="_blank"
                          href="https://feather-purple-bdd.notion.site/854f2ab70f394358b00b0ff9e2c1690a">有什么用？</Link>
                </FormHelperText>
            </FormControl>
            <TextField
                type="number"
                name="upload_kpi"
                margin="dense"
                label="上传量目标"
                fullWidth
                defaultValue={values.upload_kpi}
                onChange={handleValueChange}
                error={Boolean(showErrors.upload_kpi && errors.upload_kpi)}
                disabled={values.traffic_management_status !== 1}
                helperText={(showErrors.upload_kpi && errors.upload_kpi) || (
                    <span>
                        单位GB。主动积累上传量模式时需要设定一个要达成的目标，被动模式此值无用。
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