import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    Grid,
    MenuItem,
    Select,
    Tab,
    TextField
} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useSmartForm} from "@/components/SmartForm";
import {useGetSubRuleString, useGetSubRuleTags} from "@/utils/subscribe";
import {TabContext, TabList, TabPanel} from "@mui/lab";
import message from "@/utils/message";

export const ShareDialog = ({subId, open, handleClose, handleSubmit, name, desc, submitting}) => {
    const {data: tags} = useGetSubRuleTags();
    const {mutate: getSubRuleString} = useGetSubRuleString();
    const smartForm = useSmartForm({
        initValues: {
            name: '',
            desc: '',
            tag: ''
        }
    });
    useEffect(() => {
        smartForm.setFieldValue('name', name ? name : "")
        smartForm.setFieldValue('desc', desc ? desc : "")
    }, [name, desc]);
    const [selectTab, setSelectTab] = React.useState('all');
    const [ruleString, setRuleString] = useState('');
    useEffect(() => {
        if (!subId) {
            return;
        }
        getSubRuleString({sub_id: subId}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0 && data) {
                    setRuleString(data);
                } else {
                    message.error(msg);
                }
            }
        });
    }, [subId, selectTab])
    return (<Dialog
        open={open}
        size="sm"
        fullWidth
    >
        <DialogTitle id="alert-dialog-title">
            分享订阅规则给其他用户
        </DialogTitle>
        <DialogContent>
            <TabContext value={selectTab}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={(e, val) => setSelectTab(val)}>
                        <Tab label="分享给所有人" value="all"/>
                        <Tab label="私密分享" value="private"/>
                    </TabList>
                </Box>
                <TabPanel value="all">
                    <Grid spacing={2} sx={{mt: 1}} container>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                name="name"
                                label="规则名称"
                                helperText={"其他用户看到规则时的名称"}
                                fullWidth
                                my={3}
                                value={smartForm.values.name}
                                onChange={smartForm.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                type="text"
                                name="desc"
                                label="描述"
                                helperText={"简单介绍一下你的订阅规则有什么用，以及分享一点这条规则的设计思考吧"}
                                fullWidth
                                my={3}
                                value={smartForm.values.desc}
                                onChange={smartForm.handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <Select
                                    name="tag"
                                    value={smartForm.values.tag}
                                    onChange={smartForm.handleChange}
                                    fullWidth
                                >
                                    {tags?.data && tags.data.map((val, index) => <MenuItem key={index}
                                                                                           value={val}>{val}</MenuItem>)}
                                </Select>
                                <FormHelperText>为这个订阅规则选个标签吧</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                </TabPanel>
                <TabPanel value="private">
                    <Grid spacing={2} sx={{mt: 1}} container>
                        <Grid item xs={12}>
                            <TextField
                                label="私密规则"
                                multiline
                                rows={8}
                                variant="filled"
                                readOnly={true}
                                value={ruleString}
                                fullWidth
                            />
                            <FormHelperText>点击分享即可将内容复制到剪切板，分享给好友导入</FormHelperText>
                        </Grid>
                    </Grid>
                </TabPanel>
            </TabContext>
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>取消</Button>
            <Button onClick={() => {
                if (selectTab === 'all') {
                    handleSubmit(selectTab, subId, smartForm.values);
                } else {
                    handleSubmit(selectTab, subId, ruleString);
                }
            }} disabled={Boolean(submitting)}>
                {submitting ? "处理中" : "分享"}
            </Button>
        </DialogActions>
    </Dialog>);
}