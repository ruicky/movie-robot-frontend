import {Helmet} from "react-helmet-async";
import {Divider as MuiDivider, Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {PluginItem} from "@/pages/plugins/components/PluginItem";
import {
    useGetPluginsList,
    useGetPluginsVersionList,
    useInstallPlugin,
    useUnInstallPlugin,
    useUpgradePlugin
} from "@/api/PluginApi";
import {InstallDialog} from "@/pages/plugins/components/InstallDialog";
import message from "@/utils/message";
import {UnInstallDialog} from "@/pages/plugins/components/UnInstallDialog";
import {ConfigDialog} from "@/pages/plugins/components/ConfigDialog";
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import {Command} from "@/pages/plugins/Command";

const Divider = styled(MuiDivider)(spacing);

const PluginsIndex = () => {
    const {data: listRes, refetch: refetch} = useGetPluginsList();
    const [pluginsList, setPluginsList] = useState(null);
    const [showInstall, setShowInstall] = useState(null);
    const [showUnInstall, setShowUnInstall] = useState(null);
    const [showConfig, setShowConfig] = useState(null);
    const {mutate: getVersionList} = useGetPluginsVersionList();
    const {mutate: installPlugin, isLoading: isInstall} = useInstallPlugin();
    const {mutate: upgradePlugin, isLoading: isUpgrade} = useUpgradePlugin();
    const {mutate: unInstallPlugin, isLoading: isUnInstall} = useUnInstallPlugin();
    const [currentTab, setCurrentTab] = useState('market');

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };
    useEffect(() => {
        if (listRes?.data) {
            setPluginsList(listRes.data);
        }
    }, [listRes])
    const [versionList, setVersionList] = useState(null);
    useEffect(() => {
        if (!showInstall) {
            return;
        }
        getVersionList({plugin_id: showInstall.id}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    setVersionList(data);
                } else {
                    message.error(msg);
                }
            }
        });
    }, [showInstall]);
    const onInstall = (installed, id, values, config) => {
        let func;
        if (installed) {
            func = upgradePlugin;
        } else {
            func = installPlugin;
        }
        func({
            plugin_id: id,
            version: values.version,
            config: config
        }, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    message.success(msg);
                    refetch();
                    setShowInstall(null);
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
                    const tmp = [...pluginsList];
                    let plugin = tmp.find(x => x.pluginName === pluginName);
                    plugin.installed = false;
                    plugin.localVersion = null;
                    setPluginsList(tmp);
                } else {
                    message.error(msg);
                }
            }
        });
    }
    return (<>
        <Helmet title="应用插件"/>
        <Typography variant="h3" gutterBottom>
            应用插件
        </Typography>
        <InstallDialog
            open={Boolean(showInstall)}
            pluginId={showInstall?.id}
            pluginName={showInstall?.name}
            title={showInstall?.title ? `${showInstall.upgrade ? "更新" : "安装"}${showInstall.title}插件` : showInstall?.upgrade ? "更新" : "安装"}
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
        <TabContext value={currentTab}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList onChange={handleTabChange}>
                    <Tab label="快捷功能" value="command"/>
                    <Tab label="我的插件" value="local"/>
                    <Tab label="插件市场" value="market"/>
                </TabList>
            </Box>
            <TabPanel value="command">
                <Command/>
            </TabPanel>
            <TabPanel value="local">

            </TabPanel>
            <TabPanel value="market">
                <Grid spacing={4} container>
                    {pluginsList && pluginsList.map((item) => (
                        <Grid key={item.id} item md={6} lg={4} xl={4} sx={{width: '100%'}}>
                            <PluginItem
                                pluginId={item.id}
                                name={item.title}
                                desc={item.description}
                                authorNickname={item.author}
                                imageUrl={item.logoUrl}
                                version={`v${item.localVersion ? item.localVersion : item.lastVersion}`}
                                githubUrl={item.githubUrl}
                                docUrl={item.helpDocUrl}
                                installed={item.installed}
                                hasNew={item.hasNew}
                                onInstall={() => setShowInstall({
                                    id: item.id,
                                    name: item.pluginName,
                                    title: item.title,
                                    installed: item.installed,
                                    upgrade: false
                                })}
                                onUpgrade={() => setShowInstall({
                                    id: item.id,
                                    name: item.pluginName,
                                    title: item.title,
                                    installed: item.installed,
                                    upgrade: true
                                })}
                                onUnInstall={() => setShowUnInstall({name: item.pluginName, title: item.title})}
                                onConfig={() => setShowConfig({
                                    id: item.id,
                                    name: item.pluginName,
                                    version: item.localVersion,
                                    title: item.title,
                                    configField: item.configField
                                })}
                            />
                        </Grid>))}
                </Grid>
            </TabPanel>
        </TabContext>
    </>);
}
export default PluginsIndex;