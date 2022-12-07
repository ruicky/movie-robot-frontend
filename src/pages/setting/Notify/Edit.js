import React, {useEffect, useRef, useState} from "react";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import {Helmet} from "react-helmet-async";
import {Breadcrumbs, Button, Divider as MuiDivider, Link, Stack, Typography} from "@mui/material";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import message from "@/utils/message";
import {useDeleteNotify, useGetNotifyDefinition, useSaveNotify, useTestNotify} from "@/api/SettingApi";
import {SmartForm} from "@/components/SmartForm";

const Divider = styled(MuiDivider)(spacing);

const Form = ({channelType, channelName, title, initFormField, formData, tmplOptions}) => {
    const navigate = useNavigate();
    const formRef = useRef(null);
    const [formField, setFormField] = useState();
    const {mutateAsync: deleteNotify, isDeleting} = useDeleteNotify();
    const {mutateAsync: save, isSaving} = useSaveNotify();
    const {mutateAsync: test, isTesting} = useTestNotify();

    const onSave = () => {
        const values = formRef.current.getValues();
        let params = {"type": channelType, name: channelName, "args": values};
        save(params, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success('更改配置成功，需要重启后才能生效。')
                    navigate("/setting/index");
                } else {
                    message.error(msg)
                }
            }
        });
    }
    const onTest = () => {
        const values = formRef.current.getValues();
        let params = {"type": channelType, name: channelName, "args": values};
        test(params, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg);
                } else {
                    message.error(msg);
                }
            }
        });
    }
    const onDelete = () => {
        deleteNotify({name: channelName, type: channelType}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg);
                    navigate("/setting/index");
                } else {
                    message.error(msg);
                }
            }
        });
    }
    useEffect(() => {
        if (!initFormField || !tmplOptions) {
            return;
        }
        //设置默认参数 别名
        let field = [{
            fieldType: 'String',
            fieldName: 'name',
            label: '通道别名',
            helperText: '设置一个唯一的别名，方便被引用',
            multiValue: false,
            required: true,
            defaultValue: channelName || title
        }];
        const ff = initFormField.map((item) => {
            return {
                fieldType: item.arg_type,
                defaultValue: formData && formData[item.name] ? formData[item.name] : item.default_value,
                enumValues: item.enum_values,
                helperText: item.helper,
                label: item.label,
                multiValue: item.multi_value,
                fieldName: item.name,
                required: item.required
            }
        })
        field = field.concat(ff);
        //默认参数，通知消息设置
        field.push({
            fieldType: 'Enum',
            fieldName: 'notify_message',
            label: '推送内容',
            helperText: '产生所选消息时，推送通知',
            multiValue: true,
            required: true,
            enumValues: tmplOptions,
            defaultValue: formData && formData['notify_message'] ? formData && formData['notify_message'] : tmplOptions.map(item => item.value)
        })
        //默认参数，是否启用
        field.push({
            fieldType: 'Bool',
            fieldName: 'enable',
            label: '启用这个通知',
            helperText: '如果多个通道都启用，则同时推送',
            multiValue: false,
            required: true,
            defaultValue: formData && formData['enable'] !== null && formData['enable'] !== undefined ? formData['enable'] : true
        })
        setFormField(field);
    }, [initFormField, tmplOptions])
    return (
        <>
            <SmartForm
                formRef={formRef}
                title={title}
                fields={formField}
            />
            <Stack mt={4} direction={"row"} justifyContent={"center"} spacing={2}>
                <Button
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={onTest}
                    disabled={isTesting}
                >
                    推送一条消息测试
                </Button>
                <Button
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    onClick={onSave}
                    disabled={isSaving}
                >
                    保存设置
                </Button>
                {formData ? <Button
                    size="medium"
                    variant="contained"
                    color="error"
                    onClick={onDelete}
                    disabled={isDeleting}
                >
                    {"删除"}
                </Button> : null}
            </Stack>
        </>

    );
}
const EditNotify = () => {
    const [definition, setDefinition] = useState(null);
    const {mutateAsync: getDefinition} = useGetNotifyDefinition();
    const [title, setTitle] = useState();
    const [searchParams, setSearchParams] = useSearchParams();
    useEffect(() => {
        const type = searchParams.get("type");
        const name = searchParams.get("name");
        if (type) {
            getDefinition({channel_type: type, name}, {
                onSuccess: res => {
                    const {code, message: msg, data} = res;
                    if (code === 0) {
                        setTitle(`设置${data.name}`)
                        setDefinition(data);
                    } else {
                        message.error(msg)
                    }
                }
            });
        }
    }, [searchParams]);
    return (<React.Fragment>
        <Helmet title={title}/>
        <Typography variant="h3" gutterBottom display="inline">
            {title}
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>{title}</Typography>
        </Breadcrumbs>
        <Divider my={2}/>
        <Form
            channelType={searchParams.get("type")}
            channelName={searchParams.get("name")}
            title={definition?.name}
            initFormField={definition?.args}
            formData={definition?.config}
            tmplOptions={definition?.template_options}
        />
    </React.Fragment>);
}
export default EditNotify;