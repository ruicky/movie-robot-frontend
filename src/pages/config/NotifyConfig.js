import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";

import {FormControl, FormHelperText, MenuItem, Paper, Select, Typography} from "@mui/material";

import {useLocation, useNavigate} from "react-router-dom";
import BarkConfigComponent from "@/pages/config/notify/BarkConfigComponent";
import QywxConfigComponent from "@/pages/config/notify/QywxConfigComponent";
import PushDeerConfigComponent from "@/pages/config/notify/PushDeerConfigComponent";
import axios from "@/utils/request";
import pageMessage from "@/utils/message";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function NotifyConfig() {
    const navigate = useNavigate();
    const [app, setApp] = useState("qywx")
    const [config, setConfig] = useState({bark: null, qywx: null, pushdeer: null})
    const location = useLocation();
    let isInit = false;
    if (location.pathname.startsWith('/setup')) {
        isInit = true
    }
    const onSubmit = async (values, setMessage) => {
        let params = {"type": app, "args": values};
        const res = await axios.post("/api/config/save_notify", params);
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            pageMessage.error(message || '操作失败')
            throw new Error(message);
        }
        if (isInit) {
            navigate(data.next);
        } else {
            pageMessage.success(message || '操作成功')
            setMessage(message);
        }
    }
    const onTest = async (values, setMessage) => {
        let params = {"type": app, "args": values};
        const res = await axios.post("/api/config/test_notify", params);
        const {code, message, data} = res;
        if (code === undefined || code === 1) {
            pageMessage.error(message || '测试发送推送消息失败！');
            return
        }
        if (isInit) {
            navigate(data.next);
        } else {
            pageMessage.success(message || '操作成功')
            setMessage(message);
        }
    }
    useEffect(async () => {
        await axios.get("/api/config/get_notify").then((res) => {
            const data = res.data;
            if (data && Object.keys(data).length > 0) {
                setApp(data.default)
                setConfig(data)
            }
        });
    }, [])
    return (<React.Fragment>
        <Wrapper>
            <Helmet title={isInit ? "下载工具设置 - 初始化" : "下载工具设置"}/>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
                通知应用设置
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                设置好通知功能，可以在电影下载、整理、刮削完推送消息到手机。
            </Typography>
            <FormControl m={4} fullWidth>
                <Select
                    name="type"
                    value={app}
                    onChange={(e) => {
                        setApp(e.target.value)
                    }}
                    displayEmpty
                >
                    <MenuItem value="qywx">企业微信</MenuItem>
                    <MenuItem value="bark">Bark</MenuItem>
                    <MenuItem value="pushdeer">PushDeer</MenuItem>
                </Select>
                <FormHelperText>可以选择多个通道分别设置启用，启用多少推多少</FormHelperText>
            </FormControl>
            {app === 'qywx' &&
                <QywxConfigComponent isInit={isInit} data={config.qywx} onSubmitEvent={onSubmit} onTestEvent={onTest}/>}
            {app === 'bark' &&
                <BarkConfigComponent isInit={isInit} data={config.bark} onSubmitEvent={onSubmit} onTestEvent={onTest}/>}
            {app === 'pushdeer' &&
                <PushDeerConfigComponent isInit={isInit} data={config.pushdeer} onSubmitEvent={onSubmit}
                                         onTestEvent={onTest}/>}
        </Wrapper>
    </React.Fragment>);
}

export default NotifyConfig;
