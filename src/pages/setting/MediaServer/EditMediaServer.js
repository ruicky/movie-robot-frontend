import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Breadcrumbs,
    Button,
    Checkbox,
    Divider as MuiDivider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    Link,
    Stack,
    TextField as MuiTextField,
    Typography
} from "@mui/material";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {NavLink, useNavigate, useSearchParams} from "react-router-dom";
import {useFormik} from "formik";
import * as Yup from "yup";
import {useDeleteMediaServer, useGetMediaServer, useSaveMediaServer} from "@/api/SettingApi";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
  padding-top: 10px;
`;

function MediaServerConfigForm({type, name}) {
    const navigate = useNavigate();
    const {mutateAsync: getMediaServer} = useGetMediaServer();
    const {mutateAsync: deleteMediaServer} = useDeleteMediaServer();
    const {mutateAsync: saveMediaServer} = useSaveMediaServer();
    const [serverConfig, setServerConfig] = useState(null);
    const [tokenHelpText, setTokenHelpText] = useState();
    const [tokenLabel, setTokenLabel] = useState();
    const saveConfig = async (type, url, token, master_server, refresh_media_server, old_name, name, internet_url) => {
        saveMediaServer({type, url, token, master_server, refresh_media_server, old_name, name, internet_url}, {
            onSuccess: res => {
                const {code, message: msg} = res;
                if (code === 0) {
                    message.success('更改配置成功，需要重启后才能生效。')
                    navigate("/setting/index");
                } else {
                    message.error(msg)
                }
            }
        })
    };
    const formik = useFormik({
        initialValues: {
            old_name: '',
            name: type,
            url: "http://",
            internet_url: "",
            token: "",
            refresh_media_server: true,
            master_server: true
        }, validationSchema: Yup.object().shape({
            name: Yup.string().max(256).required("别名不能为空"),
            url: Yup.string().max(256).required("访问地址不能为空"),
            token: Yup.string().max(256).required("API密钥不能为空")
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                await saveConfig(type, values.url, values.token, values.master_server, values.refresh_media_server, values.old_name, values.name, values.internet_url);
            } catch (error) {
                const message = error.message || "配置出错啦";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });
    const onDelete = (type) => {
        deleteMediaServer({type,name}, {
            onSuccess: resData => {
                const {code, message: msg} = resData;
                if (code === 0) {
                    navigate("/setting/index");
                } else {
                    message.error(msg)
                }
            }
        })
    }
    useEffect(async () => {
        getMediaServer({}, {
            onSuccess: resData => {
                const {code, data} = resData;
                if (code === 0 && data) {
                    for (const item of data) {
                        if (item.type === type && item.name === name) {
                            formik.setFieldValue("old_name", item.name);
                            formik.setFieldValue("name", item.name);
                            formik.setFieldValue("url", item.url);
                            formik.setFieldValue("internet_url", item.internet_url);
                            formik.setFieldValue("token", item.token);
                            formik.setFieldValue("refresh_media_server", item.refresh_media_server !== undefined ? item.refresh_media_server : true);
                            formik.setFieldValue("master_server", item.master_server !== undefined ? item.master_server : true);
                            setServerConfig(item);
                            break;
                        }
                    }
                }
            },
            onError: error => message.error(error)
        });
        if (type === "emby") {
            setTokenLabel("API密钥")
            setTokenHelpText((
                <span>
                访问Emby接口查询数据时所用的密钥
                    {formik.values.url &&
                    <Link target="_blank"
                          href="https://yee329.notion.site/EmbyToken-apikey-8797c1190103463eb86a024f3405dd1e">
                        去申请API密钥
                    </Link>}
            </span>
            ));
        } else if (type === "jellyfin") {
            setTokenLabel("API密钥")
            setTokenHelpText((
                <span>
                访问Jellyfin接口查询数据时所用的密钥
                    {formik.values.url &&
                    <Link target="_blank"
                          href="https://yee329.notion.site/EmbyToken-apikey-8797c1190103463eb86a024f3405dd1e">
                        去申请API密钥
                    </Link>}
            </span>
            ))
        } else {
            setTokenLabel("Token");
            setTokenHelpText((
                <span>
                用于访问Plex接口的Token
                <Link target="_blank"
                      href="https://support.plex.tv/articles/204059436-finding-an-authentication-token-x-plex-token/">
                    学习如何获取
                </Link>
            </span>
            ));
        }
    }, [type, name]);

    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <Grid container>
            <Grid xs={12} item>
                <TextField
                    type="text"
                    name="name"
                    label="别名"
                    value={formik.values.name}
                    error={Boolean(formik.touched.name && formik.errors.name)}
                    fullWidth
                    helperText="设定一个别名展示，方便你辨识。建议和媒体服务器名称保持一致，支持更多特性"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    my={3}
                />
            </Grid>
            <Grid xs={12} item>
                <TextField
                    type="text"
                    name="url"
                    label="访问地址"
                    value={formik.values.url}
                    error={Boolean(formik.touched.url && formik.errors.url)}
                    fullWidth
                    helperText="媒体服务的访问地址（建议内网），带协议类型和端口号，如:http://192.168.1.80:8081"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    my={3}
                />
            </Grid>
            <Grid xs={12} item>
                <TextField
                    type="text"
                    name="internet_url"
                    label="外网访问地址"
                    value={formik.values.internet_url}
                    error={Boolean(formik.touched.internet_url && formik.errors.internet_url)}
                    fullWidth
                    helperText="媒体服务的外网可访问地址，用于推送读图，等高级功能使用；如：https://yee.com:8081"
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    my={3}
                />
            </Grid>
            <Grid xs={12} item>
                <TextField
                    type="text"
                    name="token"
                    label={tokenLabel}
                    value={formik.values.token}
                    error={Boolean(formik.touched.token && formik.errors.token)}
                    fullWidth
                    helperText={tokenHelpText}
                    onBlur={formik.handleBlur}
                    onChange={formik.handleChange}
                    my={3}
                />
            </Grid>
            <Grid xs={12} item>
                <FormControl>
                    <FormControlLabel control={<Checkbox name="master_server"
                                                         checked={formik.values.master_server}
                                                         onChange={formik.handleChange}/>} label="设为主要媒体服务器"/>
                    <FormHelperText>智能下载、追剧，洗版等查验是否存在的逻辑，都将使用主要媒体服务器</FormHelperText>
                </FormControl>
            </Grid>
            <Grid xs={12} item>
                <FormControl>
                    <FormControlLabel control={<Checkbox name="refresh_media_server"
                                                         checked={formik.values.refresh_media_server}
                                                         onChange={formik.handleChange}/>} label="有新增内容时自动通知媒体库刷新"/>
                    <FormHelperText>下载完成时，精准局部刷新。如果配置了多个媒体服务器，将全部通知刷新</FormHelperText>
                </FormControl>
            </Grid>
        </Grid>
        <Centered>
            <Stack spacing={2}>
                <Button
                    size="medium"
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={formik.isSubmitting}
                    fullWidth
                >
                    {"保存"}
                </Button>
                {serverConfig ? <Button
                    size="medium"
                    variant="contained"
                    color="error"
                    fullWidth
                    onClick={() => onDelete(type,name)}
                >
                    {"删除"}
                </Button> : null}
            </Stack>
        </Centered>
    </form>);
}

function EditMediaServer() {
    const [searchParams, setSearchParams] = useSearchParams();

    return (
        <React.Fragment>
            <Helmet title={"设置媒体服务"}/>
            <Typography variant="h3" gutterBottom display="inline">
                设置{searchParams.get("type").replace(/^\S/, s => s.toUpperCase())}服务
            </Typography>

            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                <Link component={NavLink} to="/setting/index">
                    设置
                </Link>
                <Typography>{searchParams.get("type").replace(/^\S/, s => s.toUpperCase())}</Typography>
            </Breadcrumbs>
            <Divider my={2}/>
            <MediaServerConfigForm type={searchParams.get("type")} name={searchParams.get("name")}/>
        </React.Fragment>
    );
}

export default EditMediaServer;