import {
    Alert as MuiAlert, Button, FormControl, FormHelperText, Link, MenuItem, Select, TextField as MuiTextField
} from "@mui/material";
import {spacing} from "@mui/system";
import React from "react";
import styled from "styled-components/macro";

const TextField = styled(MuiTextField)(spacing);

const MessageTemplateForm = ({formik, messageTemplate, setMessageTemplate}) => {
    const messageTemplateItmOnChange = (e) => {
        formik.handleChange(e)
        let mts = {...messageTemplate}
        let item = mts[formik.values.message_template]
        item[e.target.name] = e.target.value
        setMessageTemplate(mts)
    }
    const selectMessageTemplateOnChange = (e) => {
        const mt = messageTemplate[e.target.value]
        formik.handleChange(e)
        if (mt) {
            formik.setFieldValue('title', mt.title)
            formik.setFieldValue('message', mt.message)
        }
    }
    return (<React.Fragment>
        <FormControl m={4} fullWidth>
            <Select
                name="message_template"
                value={formik.values.message_template}
                onChange={selectMessageTemplateOnChange}
            >
                <MenuItem value="movie_completed">电影通知消息格式</MenuItem>
                <MenuItem value="tv_completed">剧集通知消息格式</MenuItem>
            </Select>
            <FormHelperText>目前已支持的推送应用</FormHelperText>
        </FormControl>
        <TextField
            type="text"
            name="title"
            label="通知标题"
            value={formik.values.title}
            error={Boolean(formik.touched.title && formik.errors.title)}
            fullWidth
            helperText={'最终推送到app的消息标题，可以使用占位变量自由定义格式。'}
            onBlur={formik.handleBlur}
            onChange={messageTemplateItmOnChange}
            my={3}
        />
        <TextField
            name="message"
            label="通知内容"
            value={formik.values.message}
            error={Boolean(formik.touched.message && formik.errors.message)}
            fullWidth
            helperText={'最终推送到app的消息内容，可以使用占位变量自由定义格式。'}
            onBlur={formik.handleBlur}
            onChange={messageTemplateItmOnChange}
            multiline
            maxRows={4}
            my={3}
        />
    </React.Fragment>)
}
export default MessageTemplateForm