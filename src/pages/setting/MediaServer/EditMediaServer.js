import {Helmet} from "react-helmet-async";
import {
    Alert as MuiAlert,
    Breadcrumbs,
    Button,
    Divider as MuiDivider,
    Link,
    Paper,
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
const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

const Alert = styled(MuiAlert)(spacing);

const TextField = styled(MuiTextField)(spacing);
const Centered = styled.div`
  text-align: center;
`;

function MediaServerConfigForm({type}) {
    const navigate = useNavigate();
    const {mutateAsync: getMediaServer, isLoading} = useGetMediaServer();
    const {mutateAsync: deleteMediaServer, isDeleting} = useDeleteMediaServer();
    const {mutateAsync: saveMediaServer, isSaving} = useSaveMediaServer();
    const [serverConfig, setServerConfig] = useState(null);
    const [tokenHelpText, setTokenHelpText] = useState();
    const [tokenLabel, setTokenLabel] = useState();
    const saveConfig = async (type, url, token) => {
        saveMediaServer({type, url, token}, {
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
    };
    const formik = useFormik({
        initialValues: {
            url: "http://",
            token: ""
        }, validationSchema: Yup.object().shape({
            url: Yup.string().max(256).required("访问地址不能为空"),
            token: Yup.string().max(256).required("API密钥不能为空")
        }), onSubmit: async (values, {setErrors, setStatus, setSubmitting}) => {
            try {
                await saveConfig(type, values.url, values.token);
            } catch (error) {
                const message = error.message || "配置出错啦";
                setStatus({success: false});
                setErrors({submit: message});
                setSubmitting(false);
            }
        }
    });
    const onDelete = (type) => {
        deleteMediaServer({type}, {
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
    useEffect(async () => {
        getMediaServer({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    for (const item of data) {
                        if (item.type === type) {
                            formik.setFieldValue("url", item.url);
                            formik.setFieldValue("token", item.token);
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
    }, [type]);

    return (<form noValidate onSubmit={formik.handleSubmit}>
        {formik.errors.submit && (<Alert mt={2} mb={1} severity="warning">
            {formik.errors.submit}
        </Alert>)}
        <TextField
            type="text"
            name="url"
            label="访问地址"
            value={formik.values.url}
            error={Boolean(formik.touched.url && formik.errors.url)}
            fullWidth
            helperText="媒体服务的访问地址，带协议类型和端口号"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            my={3}
        />
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
                    onClick={() => onDelete(type)}
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
            <Divider my={6}/>
            <MediaServerConfigForm type={searchParams.get("type")}/>
        </React.Fragment>
    );
}

export default EditMediaServer;