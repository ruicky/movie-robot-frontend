import {useSmartForm} from "@/components/SmartForm";
import React, {useEffect, useState} from "react";
import {Button, Grid, Stack, TextField, Typography} from "@mui/material";
import {useTestReplaceText} from "@/api/ToolsApi";

const Form = ({handleClose, handleSave, data}) => {
    const [testText, setTestText] = useState();
    const [afterTestText, setAfterTestText] = useState();
    const {mutate: testReplaceText} = useTestReplaceText();
    const smartForm = useSmartForm({
        initValues: {
            repl_expression: '',
            string: ''
        }
    });
    useEffect(() => {
        if (!data) {
            return;
        }
        const {repl_expression, string} = data.formData;
        smartForm.setFieldValue('repl_expression', repl_expression);
        smartForm.setFieldValue('string', string);
    }, [data])
    const test = () => {
        testReplaceText({
            text: testText,
            repl_expression: smartForm.values.repl_expression,
            string: smartForm.values.string
        }, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    setAfterTestText(data);
                }
            }
        })
    }
    return (
        <>
            <Grid container spacing={4}>
                <Grid xs={12} item>
                    <TextField
                        type="text"
                        name="repl_expression"
                        label="匹配"
                        helperText={"支持字符串、正则、表达式混合"}
                        fullWidth
                        my={3}
                        value={smartForm.values.repl_expression}
                        onChange={smartForm.handleChange}
                    />
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        type="text"
                        name="string"
                        label="替换为"
                        helperText={"支持字符串、表达式"}
                        fullWidth
                        my={3}
                        value={smartForm.values.string}
                        onChange={smartForm.handleChange}
                    />
                </Grid>
                <Grid xs={12} item>
                    <TextField
                        type="text"
                        name="test_text"
                        label="测试文本"
                        helperText={"输入一个你想测试的种子名或文件名"}
                        fullWidth
                        my={3}
                        value={testText}
                        onChange={(e) => {
                            setAfterTestText(null);
                            setTestText(e.target.value);
                        }}
                    />
                </Grid>
                {afterTestText && <Grid xs={12} item>
                    <Typography variant="subtitle1" gutterBottom>
                        替换后：{afterTestText}
                    </Typography>
                </Grid>}
            </Grid>
            <Stack direction="row" spacing={2} justifyContent={"right"}>
                <Button
                    size="small"
                    color="secondary"
                    onClick={handleClose}
                >
                    取消
                </Button>
                <Button
                    size="small"
                    onClick={test}
                >
                    测试
                </Button>
                <Button
                    size="small"
                    onClick={() => handleSave(data?.id, smartForm.values)}
                >
                    保存
                </Button>
            </Stack>
        </>
    );
}

export function ReplaceTextRule() {
    return {
        Form,
        preview: (filterData, options) => {
            return `${filterData.repl_expression} 替换为 ${filterData.string}`;
        }
    }
}