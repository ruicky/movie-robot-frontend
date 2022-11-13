import useHttp from "@/hooks/useHttp";
import {useMutation, useQuery} from "react-query";

export const useGetPluginsList = (param) => {
    const client = useHttp();
    return useQuery(['get_plugins_list', param], () =>
        client("/api/plugins/get_plugins_list", {params: param})
    );
};
export const useGetInstalledList = (param) => {
    const client = useHttp();
    return useQuery(['get_installed_list', param], () =>
        client("/api/plugins/get_installed_list", {params: param})
    );
};
export const useGetPluginsDetail = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/get_detail", {params: params, method: "GET"})
    );
};

export const useGetPluginsVersionList = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/get_plugins_version_list", {params: params, method: "GET"})
    );
};

export const useGetPluginsVersion = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/get_plugins_version", {params: params, method: "GET"})
    );
};

export const useInstallPlugin = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/install", {params: params, method: "POST"})
    );
};
export const useUpgradePlugin = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/upgrade", {params: params, method: "POST"})
    );
};
export const useUnInstallPlugin = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/uninstall", {params: params, method: "GET"})
    );
};
export const useGetPluginConfig = (pluginName) => {
    const client = useHttp();
    return useQuery(['get_plugin_config', pluginName], () =>
        client("/api/plugins/get_plugin_config", {params: {plugin_name: pluginName}})
    );
};
export const useSavePluginConfig = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/save_plugin_config", {params: params, method: "POST"})
    );
};
export const useGetPluginCommandList = (param) => {
    const client = useHttp();
    return useQuery(['get_plugin_command_list', param], () =>
        client("/api/plugins/get_plugin_command_list", {params: param})
    );
};
export const useRunPluginCommand = () => {
    const client = useHttp();
    return useMutation(
        (params) =>
            client("/api/plugins/run_command", {params: params, method: "POST"})
    );
};