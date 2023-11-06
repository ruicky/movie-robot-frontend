import React, {useState} from 'react';
import {useEnableSubCustomStatus, useRunSubCustom, useShareSubRule, useSubCustomList} from "@/utils/subscribe";
import {
    Avatar,
    Chip,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack
} from "@mui/material";
import { Skeleton } from "@mui/material";
import {Add as AddIcon} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useNavigate} from "react-router-dom";
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import VideocamIcon from '@mui/icons-material/Videocam';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import DeleteDialog from "@/pages/subscribe/Custom/DeleteDialog";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";
import message from "@/utils/message";
import {RunDialog} from "@/pages/subscribe/Custom/RunDialog";
import {RecordDialog} from "@/pages/subscribe/Custom/RecordDialog";
import {useInterval} from "@/utils/hooks";
import {ShareDialog} from "@/pages/subscribe/Custom/ShareDialog";
import copy from "copy-to-clipboard";
import {ImportRuleDialog} from "@/pages/subscribe/Custom/ImportRuleDialog";

function OptionMenus({enable, onEdit, onDelete, onShowLog, onRun, onEnableChange, onShare = null}) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <IconButton
                edge="end"
                aria-label="more"
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-expanded={open ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleClick}
            >
                <MoreVertIcon/>
            </IconButton>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {onShowLog && <MenuItem onClick={() => {
                    handleClose();
                    onShowLog();
                }}>
                    日志
                </MenuItem>}
                {onRun && <MenuItem onClick={() => {
                    handleClose();
                    onRun();
                }}>
                    运行
                </MenuItem>}
                <MenuItem onClick={() => {
                    handleClose();
                    onEdit();
                }}>
                    编辑
                </MenuItem>
                <MenuItem onClick={() => {
                    handleClose();
                    onEnableChange(!enable);
                }}>
                    {enable ? "禁用" : "启用"}
                </MenuItem>
                {onShare && <MenuItem onClick={() => {
                    handleClose();
                    onShare();
                }}>
                    分享
                </MenuItem>}
                <MenuItem onClick={() => {
                    handleClose();
                    onDelete();
                }}>
                    删除
                </MenuItem>
            </Menu></>
    );
}

const StatusChip = ({status, lastRunTime, enable}) => {
    if (!enable) {
        return <Chip size="small" label={"已禁用"} color={"error"}/>;
    }
    let label, color;
    if (status === 'Ready') {
        label = '待运行'
        color = 'primary';
    } else if (status === 'Running') {
        label = '运行中'
        color = 'info'
    } else {
        label = `${lastRunTime}完成`
        color = 'success'
    }
    return <Chip size="small" label={label} color={color}/>;
}

function FilterItem({
                        enable,
                        name,
                        mediaType,
                        savePath,
                        renameRule,
                        torrentFilter,
                        status,
                        lastRunTime,
                        downloadCount,
                        onEdit,
                        onDelete,
                        onShowLog,
                        onEnableChange,
                        onRun,
                        onShowRecord,
                        onShare = null
                    }) {

    return (
        <ListItem
            secondaryAction={
                <Stack direction={"row"} spacing={1}>
                    <OptionMenus enable={enable} onEdit={onEdit} onDelete={onDelete} onShowLog={onShowLog} onRun={onRun}
                                 onEnableChange={onEnableChange} onShare={onShare}/>
                </Stack>
            }
        >
            <ListItemButton onClick={onShowRecord} style={{paddingRight: 0}}>
                <ListItemAvatar>
                    <Avatar>
                        {mediaType === 'Movie' && <MovieIcon/>}
                        {mediaType === 'TV' && <TvIcon/>}
                        {mediaType === 'Other' && <VideocamIcon/>}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name}
                              secondary={`累计下载${downloadCount}个资源`}/>
                <StatusChip status={status} lastRunTime={lastRunTime} enable={enable}/>
            </ListItemButton>
        </ListItem>
    )
}

const CustomList = ({onAdd,onImport}) => {
    const navigate = useNavigate();
    const [subLogData, setSubLogData] = useState(null);
    const [runCustomSubId, setRunCustomSubId] = useState(null);
    const [showCustomSubRecord, setShowCustomSubRecord] = useState(null);
    const [showShare, setShowShare] = useState(null);
    const [showDelete, setShowDelete] = useState(null);
    const {mutate: enableSub} = useEnableSubCustomStatus();
    const {mutate: runSub} = useRunSubCustom();
    const {mutate: shareSubRule, isLoading: isSharing} = useShareSubRule();
    const {data: subCustomData, isLoading: subIsLoading, refetch: refetchSubCustomData} = useSubCustomList()
    const onEdit = (item) => {
        navigate("/subscribe/edit-custom-sub?id=" + item.id)
    }
    const onDelete = (item) => {
        setShowDelete({id: item.id, name: item.name, showDeleteRemote: item.personal && item.remote_sub_rule_id})
    }
    const onShowLog = (item) => {
        setSubLogData({
            subId: item.id,
            subType: 'CustomSub',
            title: item.name,
        })
    }
    const onDeleteSuccess = (res) => {
        refetchSubCustomData();
    }
    const onEnableChange = (item, checked) => {
        enableSub({id: item.id, enable: checked}, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    refetchSubCustomData();
                } else {
                    message.error(msg);
                }
            }
        })
    }
    const onRun = (subId, params) => {
        runSub({
            sub_id: subId,
            keyword: params.keyword,
            cate_level1: params.cate_level1,
            all_pages: params.all_pages,
            search_type: params.search_type
        }, {
            onSuccess: res => {
                const {code, message: msg, data} = res;
                if (code === 0) {
                    message.success(msg)
                    setRunCustomSubId(null);
                    refetchSubCustomData();
                } else {
                    message.error(msg);
                }
            }
        })
    }
    const onShare = (type, subId, value) => {
        if (type === "all") {
            shareSubRule({
                sub_id: subId,
                name: value.name,
                desc: value.desc,
                tag: value.tag
            }, {
                onSuccess: res => {
                    const {code, message: msg, data} = res;
                    if (code === 0) {
                        message.success(msg)
                        refetchSubCustomData();
                        setShowShare(null);
                    } else {
                        message.error(msg);
                    }
                }
            });
        } else {
            copy(value);
            message.success("已经将内容复制到剪切板，可以直接发送给好友导入")
            setShowShare(null);
        }
    }
    const autoRefreshList = () => {
        const runningList = subCustomData?.data?.filter(x => x.status === 'Running');
        if (runningList.length > 0) {
            refetchSubCustomData();
        }
    }
    useInterval(autoRefreshList, 1500)
    return (
        <>
            {showShare?.id && <ShareDialog
                subId={showShare?.id}
                open={Boolean(showShare?.id)}
                name={showShare?.name}
                desc={showShare?.desc}
                handleClose={() => setShowShare(null)}
                handleSubmit={onShare}
                submitting={isSharing}
            />}
            {showCustomSubRecord && <RecordDialog
                subId={showCustomSubRecord?.id}
                title={showCustomSubRecord?.name ? `来自${showCustomSubRecord.name}的下载记录` : "自定义订阅下载记录"}
                open={Boolean(showCustomSubRecord)}
                handleClose={() => setShowCustomSubRecord(null)}
            />}
            {runCustomSubId && <RunDialog
                subId={runCustomSubId}
                open={Boolean(runCustomSubId)}
                handleClose={() => setRunCustomSubId(null)}
                handleRun={onRun}
            />}
            {subLogData && <SubLogDialog subId={subLogData?.subId}
                                         title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                                         open={Boolean(subLogData)}
                                         handleClose={() => setSubLogData(null)}
                                         subType={subLogData?.subType}
            />}
            {showDelete && <DeleteDialog
                open={Boolean(showDelete)}
                handleClose={() => {
                    setShowDelete(null);
                }}
                id={showDelete?.id}
                name={showDelete?.name}
                showDeleteRemote={Boolean(showDelete?.showDeleteRemote)}
                onSuccess={onDeleteSuccess}
            />}

            <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                {subCustomData && subCustomData?.data ? subCustomData.data.map((item, index) => (
                    <FilterItem
                        key={index}
                        name={item?.name}
                        savePath={item?.save_path}
                        renameRule={item?.rename_rule}
                        torrentFilter={item?.torrent_filter}
                        mediaType={item?.media_type}
                        enable={item?.enable}
                        status={item?.status}
                        lastRunTime={item?.last_run_time_format}
                        downloadCount={item.dl_count}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                        onShowLog={() => onShowLog(item)}
                        onEnableChange={(checked) => onEnableChange(item, checked)}
                        onRun={() => setRunCustomSubId(item.id)}
                        onShowRecord={() => setShowCustomSubRecord({id: item.id, name: item.name})}
                        onShare={item?.personal ? () => setShowShare({
                            id: item.id,
                            name: item.name,
                            desc: item.desc
                        }) : null}
                    />
                )) : <Skeleton variant="rectangular"/>}
                <ListItem>
                    <ListItemButton onClick={onAdd}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary="新增订阅"/>
                    </ListItemButton>
                </ListItem>
                <ListItem>
                    <ListItemButton onClick={onImport}>
                        <ListItemIcon>
                            <ImportExportIcon/>
                        </ListItemIcon>
                        <ListItemText primary="导入订阅"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

};

export default CustomList;
