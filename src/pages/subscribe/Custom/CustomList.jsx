import React, {useState} from 'react';
import {useEnableSubCustomStatus, useSubCustomList} from "@/utils/subscribe";
import {
    Avatar,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Switch
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

function OptionMenus({onEdit, onDelete, onShowLog}) {
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
                    全息日志
                </MenuItem>}
                <MenuItem onClick={onEdit}>
                    编辑
                </MenuItem>
                <MenuItem onClick={onDelete}>
                    删除
                </MenuItem>
            </Menu></>
    )
}

function FilterItem({
                        enable,
                        name,
                        mediaType,
                        savePath,
                        renameRule,
                        torrentFilter,
                        onEdit,
                        onDelete,
                        onShowLog,
                        onEnableChange
                    }) {
    return (
        <ListItem
            secondaryAction={
                <Stack direction={"row"} spacing={1}><Switch
                    edge="end"
                    checked={enable}
                    onClick={e => e.stopPropagation()}
                    onChange={onEnableChange}
                /><OptionMenus onEdit={onEdit} onDelete={onDelete} onShowLog={onShowLog}/></Stack>
            }
        >
            <ListItemButton>
                <ListItemAvatar>
                    <Avatar>
                        {mediaType === 'Movie' && <MovieIcon/>}
                        {mediaType === 'TV' && <TvIcon/>}
                        {mediaType === 'Other' && <VideocamIcon/>}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name}
                              secondary={`下载到：${savePath}`}/>

            </ListItemButton>
        </ListItem>
    )
}

const CustomList = () => {
    const navigate = useNavigate();
    const [subLogData, setSubLogData] = useState(null);
    const {mutate: enableSub} = useEnableSubCustomStatus();
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
    return (
        <>
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
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                        onShowLog={() => onShowLog(item)}
                        onEnableChange={(e) => onEnableChange(item, e.target.checked)}
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
