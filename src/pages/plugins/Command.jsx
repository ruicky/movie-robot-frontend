import {Grid} from "@mui/material";
import React, {useEffect, useState} from "react";
import {useGetPluginCommandList, useRunPluginCommand} from "@/api/PluginApi";
import {CardButton} from "@/components/CardButton";
import {RunCommandDialog} from "@/pages/plugins/components/RunCommandDialog";
import message from "@/utils/message";
import {useInterval} from "@/utils/hooks";
import {string2color} from "@/utils/string2color";


export const Command = () => {
    const {data: commandListRes, refetch} = useGetPluginCommandList();
    const {mutate: run, isLoading: submitRunning} = useRunPluginCommand();
    const [commandList, setCommandList] = useState(null);
    const [showRunCommand, setShowRunCommand] = useState(null);
    useEffect(() => {
        if (!commandListRes?.data) {
            return;
        }
        setCommandList(commandListRes.data);
    }, [commandListRes]);
    const autoRefreshList = () => {
        const runningList = commandList?.filter(x => x.status === 'running');
        if (runningList.length > 0) {
            refetch();
        }
    };
    useInterval(autoRefreshList, 1000);
    const setCommandStatus = (pluginName, commandName, status) => {
        const tmp = [...commandList];
        const c = tmp.find(x => x.plugin_name === pluginName && x.name === commandName);
        if (c) {
            c.status = status;
            setCommandList(tmp);
        }
    }
    const summitRun = (pluginName, commandName, args = null) => {
        setCommandStatus(pluginName, commandName, 'running')
        run({
            plugin_name: pluginName,
            command_name: commandName,
            args: args
        }, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0 && data) {
                    if (data.run_in_background) {
                        setCommandStatus(pluginName, commandName, 'running');
                        message.success(msg);
                    } else {
                        setCommandStatus(pluginName, commandName, 'done');
                        message.success(msg);
                    }
                    setShowRunCommand(null);
                } else {
                    setCommandStatus(pluginName, commandName, 'error')
                    message.error(msg);
                }
            }
        });
    }
    const handleCardButtonClick = (command, status) => {
        if (status === 'running') {
            message.warn("已经在运行了，不要重复点击了")
            return;
        }
        if (command.arg_schema && command.arg_schema.length > 0) {
            setShowRunCommand({
                commandName: command.name,
                pluginName: command.plugin_name,
                argsSchema: command.arg_schema?.map((f) => {
                    return {
                        fieldName: f.name,
                        fieldType: f.arg_type,
                        label: f.label,
                        helperText: f.helper,
                        defaultValue: f.default_value,
                        required: f.required,
                        enumValues: f.enum_values
                    }
                }),
                title: `运行${command.title}`
            });
        } else {
            summitRun(command.plugin_name, command.name);
        }
    }
    return <>
        <RunCommandDialog
            open={Boolean(showRunCommand)}
            handleClose={() => setShowRunCommand(null)}
            commandName={showRunCommand?.commandName}
            pluginName={showRunCommand?.pluginName}
            argsSchema={showRunCommand?.argsSchema}
            title={showRunCommand?.title ? showRunCommand?.title : ''}
            isRunning={submitRunning}
            onSubmit={summitRun}
        />
        <Grid xs={0} spacing={3} container>
            {commandList && commandList.map((item) => {
                // md={6} lg={4} xl={3} 
                return <Grid key={item.name} xs={6} sm={4} md={3} lg={2} item>
                    <CardButton
                        color={string2color(`${item.plugin_name}${item.name}`)}
                        icon={item.icon}
                        label={item.title}
                        helper={item.desc}
                        status={item.status}
                        onClick={(status) => handleCardButtonClick(item, status)}
                    />
                </Grid>
            })}
        </Grid>
    </>;
}