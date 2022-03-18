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
import React, {useEffect, useState} from "react";
import {ptSiteData} from "../../config";


const SetSite = ({opType, open, site, filterSiteNames, onSubmit, onClose}) => {
    const [values, setValues] = React.useState({
        site_name: "mteam", cookie: "", web_search: true, smart_download: true
    });
    const [siteData, setSiteData] = useState(ptSiteData)
    const [errors, setErrors] = React.useState({});
    const [showErrors, setShowErrors] = React.useState({});
    const handleValueChange = (e) => {
        if (e.target.type === "checkbox") {
            setValues({...values, [e.target.name]: e.target.checked});
        } else {
            setValues({...values, [e.target.name]: e.target.value});
        }
    };
    useEffect(() => {
        if (opType === "add" && filterSiteNames !== undefined && filterSiteNames.length > 0) {
            let data = []
            ptSiteData.map((val, i) => {
                if (!filterSiteNames.includes(val.name)) {
                    data.push(val)
                }
            })
            setSiteData(data)
            setValues({...values, site_name: data[0].name})
        } else {
            setSiteData(ptSiteData)
        }
        if (site !== undefined && site !== null) {
            setValues({
                site_name: site.site_name,
                cookie: site.cookie,
                web_search: site.web_search === 1 ? true : false,
                smart_download: site.smart_download === 1 ? true : false
            })
        } else {
            setValues({
                site_name:"",cookie: "", web_search: true, smart_download: true
            })
        }
    }, [opType, site, filterSiteNames])
    return (<Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="form-dialog-title"
    >
        <DialogTitle id="form-dialog-title">{opType === "add" ? "新增站点" : "编辑站点"}</DialogTitle>
        <DialogContent>
            <DialogContentText>
                站点将用于搜索和智能下载任务。
            </DialogContentText>
            <FormControl fullWidth>
                <Select
                    name="site_name"
                    value={values.site_name}
                    onChange={(e) => handleValueChange(e)}
                    disabled={opType === "update"}
                >
                    {siteData.map((row) => (<MenuItem key={row.name} value={row.name}>{row.domain}</MenuItem>))}
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
                helperText={showErrors.cookie && errors.cookie}
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
            <Button color="primary" onClick={() => onSubmit(values)}>
                提交
            </Button>
            <Button onClick={onClose} color="primary">
                取消
            </Button>
        </DialogActions>
    </Dialog>);
}
export default SetSite