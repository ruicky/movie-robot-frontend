import React, {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components/macro";
import * as Yup from "yup";
import {useFormik} from "formik";
import axios from "../../../utils/request";

import {
    Alert as MuiAlert, Button, FormControl, FormHelperText, Link, MenuItem, Select, TextField as MuiTextField
} from "@mui/material";
import {spacing} from "@mui/system";
import ScoreRuleSelectComponent from "@/components/core/ScoreRuleSelectComponent";
import UserConfigComponent from "@/pages/config/douban/UserConfigComponent";
import TagConfigComponent from "@/pages/config/douban/TagConfigComponent";
import DownloadPathConfigComponent from "@/pages/config/douban/DownloadPathConfigComponent";
import pageMessage from "@/utils/message";

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function DoubanConfigComponent({}) {
    const navigate = useNavigate();
    const [ruleData, setRuleData] = useState([])
    const [users, setUsers] = useState([{id: '', nickname: '', pull_time_range: 365, score_rule: 'compress'}])
    const [tags, setTags] = useState([])
    const [downloadPath, setDownloadPath] = useState([{type: "movie", cate: [], area: [], score_rule: 'compress'}])
    const [message, setMessage] = useState();
    const [userFormHasError, setUserFormHasError] = useState(false)
    const [pathFormHasError, setPathFormHasError] = useState(false)
    const saveConfig = async (params) => {
        const res = await axios.post("/api/config/save_douban", params);
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            throw new Error(message);
        }
        setMessage(message);
        pageMessage.success(message || '操作成功')
    };
    const formik = useFormik({
        initialValues: {
            default_score_rule: 'compress', cron: '0,30 0-2,9-23 * * *', cookie: ''
        }, validationSchema: Yup.object().shape({
            default_score_rule: Yup.string().max(256).required(),
            cron: Yup.string().max(256).required(),
            cookie: Yup.string().max(256).required()
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            if (userFormHasError) {
                return
            }
            try {
                await setSubmitting(true);
                console.log(downloadPath)
                await saveConfig(values);
            } catch (error) {
                const message = error.message || "配置出错啦";
                pageMessage.error(message)
                setStatus({success: false});
                setErrors({submit: message});
            } finally {
                await setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        let res = await axios.get("/api/common/rules")
        setRuleData(res.data)
        await axios.get("/api/config/get_douban").then((res) => {
            const data = res.data;
            if (data !== undefined && data !== null) {
                formik.setFieldValue("tmdb_api_key", data.tmdb_api_key);
                formik.setFieldValue("fanart_api_key", data.fanart_api_key);
            }
        });
    }, []);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        {message && (<Alert severity="success" my={3}>
            {message}
        </Alert>)}
        <TextField
            type="text"
            name="cron"
            label="任务下载时间"
            value={formik.values.cron}
            error={Boolean(formik.touched.cron && formik.errors.cron)}
            fullWidth
            helperText={(<span>
                    Linux CRON表达式，默认每天上午9点至凌晨2点，每半小时一次
                    <Link target="_blank"
                          href="https://tool.lu/crontab/">
                            去测试表达式
                        </Link>
                </span>)}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="cookie"
            label="Cookie"
            value={formik.values.cookie}
            error={Boolean(formik.touched.cookie && formik.errors.cookie)}
            fullWidth
            helperText={(<span>
                    任意用户访问豆瓣的Cookie，一些电影不登陆读不到详情
                    <Link target="_blank"
                          href="https://movie.douban.com/">
                            去获取Cookie
                        </Link>
                </span>)}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <UserConfigComponent ruleData={ruleData} users={users} setUsers={setUsers}
                             submitting={formik.isSubmitting}
                             setHasError={setUserFormHasError}/>
        <DownloadPathConfigComponent data={downloadPath} setData={setDownloadPath} submitting={formik.isSubmitting}
                                     setHasError={setPathFormHasError}/>
        <TagConfigComponent ruleData={ruleData} tags={tags} setTags={setTags}/>
        <Centered>
            <Button
                mr={2}
                size="medium"
                type="submit"
                variant="contained"
                color="primary"
                disabled={formik.isSubmitting}
                fullWidth
            >
                保存
            </Button>
        </Centered>

    </form>);
}

export default DoubanConfigComponent;
