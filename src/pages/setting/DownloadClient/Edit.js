import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Breadcrumbs,
    Button,
    Checkbox,
    Divider as MuiDivider,
    FormControlLabel,
    Link,
    Stack,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDeleteDownloadClient, useGetDownloadClient, useSaveDownloadClient} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function DownloadClientForm({name, type}) {
    const navigate = useNavigate();
    const [clientConfig, setClientConfig] = useState();
    const {mutateAsync: getDownloadClient, isLoading} = useGetDownloadClient();
    const {mutateAsync: saveDownloadClient, isSaving} = useSaveDownloadClient();
    const {mutateAsync: deleteDownloadClient, isDeleting} = useDeleteDownloadClient();
    const onDelete = (name) => {
        deleteDownloadClient({name}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    navigate("/setting/index");
                } else {
                    message.error(msg)
                }
            }
        })
    }
    const formik = useFormik({
        initialValues: {
            name: "",
            url: "http://",
            username: "",
            password: "",
            need_login: true,
            monitor_all_torrents: false,
            is_default: true
        }, validationSchema: Yup.object().shape({
            name: Yup.string().max(256).required("名称不能为空"),
            url: Yup.string().max(256).required("访问地址不能为空"),
            username: Yup.string().when("need_login", {
                is: true,
                then: Yup.string().max(256).required("登陆账号不能为空")
            }),
            password: Yup.string().when("need_login", {
                is: true,
                then: Yup.string().max(256).required("登陆密码不能为空")
            })
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                setSubmitting(true);
                saveDownloadClient({
                    type,
                    edit_name: name,
                    name: values.name,
                    url: values.url,
                    username: values.username,
                    password: values.password,
                    need_login: values.need_login,
                    monitor_all_torrents: values.monitor_all_torrents,
                    is_default: values.is_default
                }, {
                    onSuccess: res => {
                        const {code, message: msg, data} = res;
                        if (code === 0) {
                            message.success('更改配置成功，需要重启后才能生效。')
                            navigate("/setting/index");
                        } else {
                            message.error(msg)
                        }
                    }
                })
            } catch (error) {
                const msg = error.message || "配置出错啦";
                setStatus({success: false});
                setErrors({submit: msg});
                setSubmitting(false);
            }
        }
    });

    useEffect(async () => {
        getDownloadClient({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    for (const item of data) {
                        if (name && item.name === name) {
                            setClientConfig(item);
                            formik.setFieldValue("name", item?.name ? item.name : "");
                            formik.setFieldValue("url", item?.url ? item.url : "");
                            formik.setFieldValue("username", item?.username ? item.username : "");
                            formik.setFieldValue("password", item?.password ? item.password : "");
                            formik.setFieldValue("need_login", item?.need_login !== null && item.need_login !== undefined ? item.need_login : true);
                            formik.setFieldValue("monitor_all_torrents", item?.monitor_all_torrents !== null && item?.monitor_all_torrents !== undefined ? item.monitor_all_torrents : false);
                            formik.setFieldValue("is_default", item?.is_default !== null && item?.is_default !== undefined ? item.is_default : false);
                        }
                    }
                }
            },
            onError: error => message.error(error)
        });
    }, [type]);
    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="text"
            name="name"
            label="名称"
            value={formik.values.name}
            error={Boolean(formik.touched.name && formik.errors.name)}
            fullWidth
            helperText="设定一个别名，方便记住"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="url"
            label="访问地址"
            value={formik.values.url}
            error={Boolean(formik.touched.url && formik.errors.url)}
            fullWidth
            helperText="网站服务的访问地址，带协议类型和端口号"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="username"
            label={"登陆账号"}
            value={formik.values.username}
            error={Boolean(formik.touched.username && formik.errors.username)}
            fullWidth
            helperText={(formik.touched.username && formik.errors.username) || "用于登陆的管理账号"}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <TextField
            type="text"
            name="password"
            label={"登陆密码"}
            value={formik.values.password}
            error={Boolean(formik.touched.password && formik.errors.password)}
            fullWidth
            helperText={(formik.touched.password && formik.errors.password) || "用于登陆的密码"}
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
        <FormControlLabel
            control={<Checkbox
                checked={formik.values.is_default}
                onChange={formik.handleChange}
                name="is_default"
            />}
            label="设为默认"
        />
        {type === "qbittorrent" && <FormControlLabel
            control={<Checkbox
                checked={formik.values.need_login}
                onChange={formik.handleChange}
                name="need_login"
            />}
            label="需要登陆(没配置内网免登必须勾选)"
        />}
        <FormControlLabel
            control={<Checkbox
                checked={formik.values.monitor_all_torrents}
                onChange={formik.handleChange}
                name="monitor_all_torrents"
            />}
            label="监控手动提交到下载器指定目录的种子"
        />
        <Centered>
            <Stack spacing={2}>
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
                {clientConfig ? <Button
                    size="medium"
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => onDelete(name)}
                >
                    {"删除"}
                </Button> : null}
            </Stack>
        </Centered>

    </form>);
}

const Edit = () => {
    const [title, setTitle] = useState();
    const [searchParams, setSearchParams] = useSearchParams();

    useEffect(() => {
        const type = searchParams.get("type").replace(/^\S/, s => s.toUpperCase())
        if (searchParams.get("name")) {
            setTitle(`编辑${searchParams.get("name")}`)
        } else {
            setTitle(`添加${type}`)
        }
    }, [searchParams])
    return (<React.Fragment>
        <Helmet title={title}/>
        <Typography variant="h3" gutterBottom display="inline">
            {title}
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>{searchParams.get("type").replace(/^\S/, s => s.toUpperCase())}</Typography>
        </Breadcrumbs>
        <Divider my={6}/>
        <DownloadClientForm name={searchParams.get("name")} type={searchParams.get("type")}/>
    </React.Fragment>);
}
export default Edit;