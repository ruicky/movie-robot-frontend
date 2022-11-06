import {Helmet} from "react-helmet-async";
import {Breadcrumbs, Button, Divider as MuiDivider, Grid, Link, Paper, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import Changelog from "@/pages/plugins/components/Changelog";
import {NavLink, useSearchParams} from "react-router-dom";
import {useGetPluginsDetail, useGetPluginsVersionList, useInstallPlugin, useUnInstallPlugin} from "@/api/PluginApi";
import message from "@/utils/message";
import {InstallDialog} from "@/pages/plugins/components/InstallDialog";
import {UnInstallDialog} from "@/pages/plugins/components/UnInstallDialog";
import {ConfigDialog} from "@/pages/plugins/components/ConfigDialog";

const Img = styled('img')({
    maxWidth: '100%',
    maxHeight: 235,
    borderRadius: '8px'
});
const Divider = styled(MuiDivider)(spacing);

const PluginsDetail = () => {
    const [showInstall, setShowInstall] = useState(null);
    const [showUnInstall, setShowUnInstall] = useState(null);
    const [showConfig, setShowConfig] = useState(null);
    const [plugin, setPlugin] = useState(null);
    const [versionList, setVersionList] = useState(null);
    const {mutate: getDetail} = useGetPluginsDetail();
    const {mutate: getVersionList} = useGetPluginsVersionList();
    const {mutate: installPlugin, isLoading: isInstall} = useInstallPlugin();
    const {mutate: unInstallPlugin, isLoading: isUnInstall} = useUnInstallPlugin();
    const [queryString, setQueryString] = useSearchParams();
    useEffect(() => {
        if (!queryString.get("pluginId")) {
            return;
        }
        getDetail({plugin_id: queryString.get("pluginId")}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    setPlugin(data);
                } else {
                    message.error(msg);
                }
            }
        });
        getVersionList({plugin_id: queryString.get("pluginId")}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    setVersionList(data);
                } else {
                    message.error(msg);
                }
            }
        });
    }, [queryString]);
    const onInstall = (id, values, config) => {
        installPlugin({
            plugin_id: id,
            version: values.version,
            config: config
        }, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    message.success(msg);
                    setShowInstall(null);
                    plugin.installed = true;
                    plugin.localVersion = values.version;
                    setPlugin(plugin);
                } else {
                    message.error(msg);
                }
            }
        });
    }
    const onUnInstall = (pluginName, values) => {
        unInstallPlugin({
            plugin_name: pluginName,
            delete_config: values.deleteConfig
        }, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    message.success(msg);
                    setShowUnInstall(null);
                    plugin.installed = false;
                    plugin.localVersion = null;
                    setPlugin(plugin);
                } else {
                    message.error(msg);
                }
            }
        });
    }
    return (
        <>
            <Helmet title="插件"/>
            <Typography variant="h3" gutterBottom>
                插件
            </Typography>
            <Breadcrumbs aria-label="Breadcrumb" mt={2}>
                <Link component={NavLink} to="/plugins/index">
                    全部插件
                </Link>
                <Typography>插件详情</Typography>
            </Breadcrumbs>
            <Divider my={4}/>
            <InstallDialog
                open={Boolean(showInstall)}
                pluginId={showInstall?.id}
                pluginName={showInstall?.name}
                title={showInstall?.title ? `安装${showInstall.title}插件` : "安装插件"}
                versionList={versionList}
                handleClose={() => setShowInstall(null)}
                submitting={isInstall}
                handleSubmit={onInstall}
                installed={showInstall?.installed}
            />
            <UnInstallDialog
                open={Boolean(showUnInstall)}
                pluginName={showUnInstall?.name}
                title={showUnInstall?.title ? `卸载${showUnInstall.title}插件` : "卸载插件"}
                handleClose={() => setShowUnInstall(null)}
                submitting={isUnInstall}
                handleSubmit={onUnInstall}
            />
            <ConfigDialog
                open={Boolean(showConfig)}
                pluginId={showConfig?.id}
                pluginName={showConfig?.name}
                version={showConfig?.version}
                pluginConfigField={showConfig?.configField}
                title={showConfig?.title ? `${showConfig.title}的设置` : "插件设置"}
                handleClose={() => setShowConfig(null)}
            />
            <Paper
                sx={{
                    p: 2,
                    margin: 'auto',
                    flexGrow: 1,
                    backgroundColor: (theme) =>
                        theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
                }}
            >
                <Grid container spacing={2}>
                    <Grid item>
                        <Img src={plugin?.logoUrl}/>
                    </Grid>
                    <Grid sx={{m: 2}} item xs container direction="column" spacing={2}>
                        <Grid item xs>
                            <Typography gutterBottom variant="h5" component="div">
                                {plugin?.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                由 {plugin?.author} 开发
                            </Typography>
                            <Typography variant="body">
                                {plugin?.description}
                            </Typography>
                        </Grid>
                        <Grid sx={{marginLeft:"auto"}} item>
                            {!plugin?.installed && <Button onClick={() => setShowInstall({
                                id: plugin.id,
                                name: plugin.pluginName,
                                title: plugin.title,
                                installed: plugin.installed
                            })}>
                                安装
                            </Button>}
                            {plugin?.installed && <Button onClick={() => setShowConfig({
                                id: plugin.id,
                                name: plugin.pluginName,
                                version: plugin.localVersion,
                                title: plugin.title,
                                configField: plugin.configField
                            })}>
                                配置
                            </Button>}
                            {plugin?.installed && <Button onClick={() => setShowUnInstall({name: plugin.pluginName, title: plugin.title})}>
                                卸载
                            </Button>}
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
            <Divider my={4}/>
            {versionList && <Changelog items={versionList.map((item) => {
                return {
                    version: item.version,
                    date: item.gmtCreate,
                    body: item.changelog
                };
            })}/>}
        </>
    );
}
export default PluginsDetail;