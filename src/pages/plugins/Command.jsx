import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGetPluginCommandList, useRunPluginCommand } from "@/api/PluginApi";
import { CardButton } from "@/components/CardButton";
import { RunCommandDialog } from "@/pages/plugins/components/RunCommandDialog";
import message from "@/utils/message";
import { useInterval } from "@/utils/hooks";
import { string2color } from "@/utils/string2color";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Icon } from '@iconify/react';

export const Command = () => {
    const { data: commandListRes, refetch } = useGetPluginCommandList();
    const { mutate: run, isLoading: submitRunning } = useRunPluginCommand();
    const [commandList, setCommandList] = useState(null);
    const [showRunCommand, setShowRunCommand] = useState(null);
    const [pluginArr, setPluginArr] = useState([]);
    const [pluginOrder, setPluginOrder] = useState(localStorage.getItem('pluginOrder') || []);

    useEffect(() => {
        if (!commandListRes?.data) {
            return;
        }
        setCommandList(commandListRes.data);
        // 转为二维数组
        const tmp = commandListRes.data.reduce((acc, cur) => {
            if (!acc[cur.plugin_name]) {
                acc[cur.plugin_name] = [];
            }
            acc[cur.plugin_name].push(cur);
            return acc;
        }, {});
        const arr = Object.keys(tmp).map(x => {
            return {
                plugin_name: x,
                plugin_title: tmp[x][0].plugin_title,
                commands: tmp[x]
            }
        });
        setPluginArr(arr);
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
                const { code, message: msg, data } = resData;
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
        if (command.has_args) {
            setShowRunCommand({
                commandName: command.name,
                pluginName: command.plugin_name,
                title: `运行${command.title}`
            });
        } else {
            summitRun(command.plugin_name, command.name);
        }
    }

    const onDragEnd = (result) => {
        if (!result.destination) {
            return;
        }
        if (result.mode === 'FLUID') {
            const sourceIndex = result.source.index;
            const destinationIndex = result.destination.index;
            const tmpOrder = pluginArr.map(x => x.plugin_name);
            tmpOrder.splice(destinationIndex, 0, tmpOrder.splice(sourceIndex, 1)[0]);
            setPluginOrder(tmpOrder);
            localStorage.setItem('pluginOrder', tmpOrder);
        }
    }

    const sortPlugin = (a, b) => {
        const aIndex = pluginOrder.indexOf(a.plugin_name);
        const bIndex = pluginOrder.indexOf(b.plugin_name);
        if (aIndex === -1 && bIndex === -1) {
            return 0;
        }
        if (aIndex === -1) {
            return 1;
        }
        if (bIndex === -1) {
            return -1;
        }
        return aIndex - bIndex;
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
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => <div {...provided.droppableProps} ref={provided.innerRef}>
                    {pluginArr.sort(sortPlugin).map((plugin, index) => {
                        const pluginTitle = plugin.plugin_title;
                        const pluginName = plugin.plugin_name;
                        const commands = plugin.commands;
                        return <Draggable key={pluginName} draggableId={pluginName} index={index}>
                            {(provided) => (<div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                className="tw-mb-6">
                                <h2 className="tw-text-lg tw-mb-3 tw-flex tw-justify-start tw-items-center  ">
                                    <div {...provided.dragHandleProps} className="tw-p-2">
                                        <Icon icon="tabler:drag-drop" />
                                    </div>
                                    <div>
                                        {pluginTitle}
                                    </div>
                                </h2>
                                <Grid xs={0} spacing={3} container>
                                    {commands.map((item) => {
                                        return <Grid key={item.name} xs={6} sm={4} md={3} lg={2} item>
                                            <CardButton
                                                color={string2color(`${item.name}${item.plugin_name}${item.plugin_title}`)}
                                                icon={item.icon}
                                                label={item.title}
                                                helper={item.desc}
                                                status={item.status}
                                                statusMessage={item.status_message}
                                                onClick={(status) => handleCardButtonClick(item, status)}
                                            />
                                        </Grid>
                                    })}
                                </Grid>
                            </div>)}
                        </Draggable>
                    })}
                    {provided.placeholder}
                </div>
                }
            </Droppable>
        </DragDropContext >
    </>;
}