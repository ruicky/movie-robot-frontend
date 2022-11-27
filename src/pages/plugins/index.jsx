import {Helmet} from "react-helmet-async";
import {Grid, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import {PluginItem} from "@/pages/plugins/components/PluginItem";
import {
    useGetInstalledList,
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
import {DonateDialog} from "@/pages/plugins/components/DonateDialog";

const PluginList = ({data, setShowInstall, setShowUnInstall, setShowConfig, setShowDonate}) => {
    return <Grid spacing={4} container>
        {data && data.map((item) => (
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
                    payImageUrl={item.payImageUrl}
                    installed={item.installed}
                    hasNew={item.hasNew}
                    hasConfig={item.hasConfig}
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
                    onDonate={() => setShowDonate({
                        payImageUrl: item.payImageUrl
                    })}
                />
            </Grid>))}
    </Grid>
}
const PluginsIndex = () => {
    const {data: marketPluginsRes, refetch: refetch} = useGetPluginsList();
    const {data: installedPluginsRes, refetch: refetchInstalled} = useGetInstalledList();
    const [installedPluginsList, setInstalledPluginsList] = useState(null);
    const [marketPluginsList, setMarketPluginsList] = useState(null);
    const [showInstall, setShowInstall] = useState(null);
    const [showUnInstall, setShowUnInstall] = useState(null);
    const [showConfig, setShowConfig] = useState(null);
    const [showDonate, setShowDonate] = useState(null);
    const {mutate: getVersionList} = useGetPluginsVersionList();
    const {mutate: installPlugin, isLoading: isInstall} = useInstallPlugin();
    const {mutate: upgradePlugin, isLoading: isUpgrade} = useUpgradePlugin();
    const {mutate: unInstallPlugin, isLoading: isUnInstall} = useUnInstallPlugin();
    const [currentTab, setCurrentTab] = useState('command');

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };
    useEffect(() => {
        if (marketPluginsRes?.data) {
            setMarketPluginsList(marketPluginsRes.data);
        } else {
            setMarketPluginsList(null);
        }
    }, [marketPluginsRes]);
    useEffect(() => {
        if (installedPluginsRes?.data) {
            setInstalledPluginsList(installedPluginsRes.data);
        } else {
            setInstalledPluginsList(null);
        }
    }, [installedPluginsRes]);
    useEffect(() => {
        if (!installedPluginsList || !marketPluginsList) {
            return;
        }
        if (installedPluginsList.length > 0 && !installedPluginsList[0].checkNew) {
            let tmp = [...installedPluginsList];
            //从市场列表返回的数据中，检查更新
            tmp = tmp.map((item) => {
                const remotePlugin = marketPluginsList.find(x => x.pluginName === item.pluginName)
                if (remotePlugin) {
                    item['hasNew'] = remotePlugin['hasNew']
                    item['lastVersion'] = remotePlugin['lastVersion']
                    item['payImageUrl'] = remotePlugin['payImageUrl']
                }
                item['checkNew'] = true
                return item;
            });
            setInstalledPluginsList(tmp);
        }
    }, [installedPluginsList, marketPluginsList])
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
                    refetchInstalled();
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
                    const tmp = [...marketPluginsList];
                    let plugin = tmp.find(x => x.pluginName === pluginName);
                    plugin.installed = false;
                    plugin.localVersion = null;
                    setMarketPluginsList(tmp);
                    refetchInstalled();
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
        <DonateDialog
            open={Boolean(showDonate)}
            payImageUrl={showDonate?.payImageUrl}
            handleClose={() => setShowDonate(null)}
        />
        <TabContext value={currentTab}>
            <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                <TabList onChange={handleTabChange}>
                    <Tab label="快捷功能" value="command"/>
                    <Tab label="我的插件" value="local"/>
                    <Tab label="插件市场" value="market"/>
                </TabList>
            </Box>
            <TabPanel value="command" sx={{p: 0, pt: 3}}>
                <Command/>
            </TabPanel>
            <TabPanel value="local" sx={{p: 0, pt: 3}}>
                <PluginList data={installedPluginsList} setShowConfig={setShowConfig} setShowInstall={setShowInstall}
                            setShowUnInstall={setShowUnInstall} setShowDonate={setShowDonate}/>
            </TabPanel>
            <TabPanel value="market" sx={{p: 0, pt: 3}}>
                <PluginList data={marketPluginsList} setShowConfig={setShowConfig} setShowInstall={setShowInstall}
                            setShowUnInstall={setShowUnInstall} setShowDonate={setShowDonate}/>
            </TabPanel>
        </TabContext>
    </>);
}
export default PluginsIndex;