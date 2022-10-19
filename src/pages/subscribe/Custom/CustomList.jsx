import React, {useState} from 'react';
import {useEnableSubCustomStatus, useRunSubCustom, useSubCustomList} from "@/utils/subscribe";
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
    MenuItem, Stack
} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {Add as AddIcon} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useNavigate} from "react-router-dom";
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import VideocamIcon from '@mui/icons-material/Videocam';
import DeleteDialog from "@/pages/subscribe/Custom/DeleteDialog";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";
import message from "@/utils/message";
import {RunDialog} from "@/pages/subscribe/Custom/RunDialog";
import {RecordDialog} from "@/pages/subscribe/Custom/RecordDialog";
import {useInterval} from "@/utils/hooks";

function OptionMenus({enable, onEdit, onDelete, onShowLog, onRun, onEnableChange}) {
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
                {onShowLog && <MenuItem onClick={onShowLog}>
                    日志
                </MenuItem>}
                {onRun && <MenuItem onClick={onRun}>
                    运行
                </MenuItem>}
                <MenuItem onClick={onEdit}>
                    编辑
                </MenuItem>
                <MenuItem onClick={onEnableChange}>
                    {enable ? "禁用" : "启用"}
                </MenuItem>
                <MenuItem onClick={onDelete}>
                    删除
                </MenuItem>
            </Menu></>
    )
}

const StatusChip = ({status, lastRunTime}) => {
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
                        onShowRecord
                    }) {

    return (
        <ListItem
            secondaryAction={
                <Stack direction={"row"} spacing={1}>
                    <OptionMenus enable={enable} onEdit={onEdit} onDelete={onDelete} onShowLog={onShowLog} onRun={onRun}
                                 onEnableChange={onEnableChange}/>
                </Stack>
            }
        >
            <ListItemButton onClick={onShowRecord} style={{paddingRight:0}}>
                <ListItemAvatar>
                    <Avatar>
                        {mediaType === 'Movie' && <MovieIcon/>}
                        {mediaType === 'TV' && <TvIcon/>}
                        {mediaType === 'Other' && <VideocamIcon/>}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name}
                              secondary={`累计下载${downloadCount}个资源`}/>
                <StatusChip status={status} lastRunTime={lastRunTime}/>
            </ListItemButton>
        </ListItem>
    )
}

const CustomList = () => {
    const navigate = useNavigate();
    const [subLogData, setSubLogData] = useState(null);
    const [runCustomSubId, setRunCustomSubId] = useState(null);
    const [showCustomSubRecord, setShowCustomSubRecord] = useState(null);
    const {mutate: enableSub} = useEnableSubCustomStatus();
    const {mutate: runSub} = useRunSubCustom();
    const {data: subCustomData, isLoading: subIsLoading, refetch: refetchSubCustomData} = useSubCustomList()
    const [deleteFilterName, setDeleteFilterName] = useState(null)
    const [deleteFilterId, setDeleteFilterId] = useState(null)
    const onEdit = (item) => {
        navigate("/subscribe/edit-custom-sub?id=" + item.id)
    }
    const onDelete = (item) => {
        setDeleteFilterId(item.id);
        setDeleteFilterName(item.filter_name)
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
    const autoRefreshList = () => {
        const runningList = subCustomData?.data?.filter(x => x.status === 'Running');
        if (runningList.length > 0) {
            refetchSubCustomData();
        }
    }
    useInterval(autoRefreshList, 1500)
    return (
        <>
            <RecordDialog
                subId={showCustomSubRecord?.id}
                title={showCustomSubRecord?.name ? `来自${showCustomSubRecord.name}的下载记录` : "自定义订阅下载记录"}
                open={Boolean(showCustomSubRecord)}
                handleClose={() => setShowCustomSubRecord(null)}
            />
            <RunDialog
                subId={runCustomSubId}
                open={Boolean(runCustomSubId)}
                handleClose={() => setRunCustomSubId(null)}
                handleRun={onRun}
            />
            <SubLogDialog subId={subLogData?.subId}
                          title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                          open={Boolean(subLogData)}
                          handleClose={() => setSubLogData(null)}
                          subType={subLogData?.subType}
            />
            <DeleteDialog
                open={!!deleteFilterId}
                handleClose={() => {
                    setDeleteFilterId(null);
                    setDeleteFilterName(null);
                }}
                id={deleteFilterId}
                filterName={deleteFilterName}
                onSuccess={onDeleteSuccess}
            />
            <List sx={{mt: 4, width: '100%', bgcolor: 'background.paper'}}>
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
                        onEnableChange={(e) => onEnableChange(item, e.target.checked)}
                        onRun={() => setRunCustomSubId(item.id)}
                        onShowRecord={() => setShowCustomSubRecord({id: item.id, name: item.name})}
                    />
                )) : <Skeleton variant="rectangular"/>}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/subscribe/edit-custom-sub")}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary="添加"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );

};

export default CustomList;
