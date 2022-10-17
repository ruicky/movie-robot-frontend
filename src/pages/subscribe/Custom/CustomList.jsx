import React, {useState} from 'react';
import {useSubCustomList} from "@/utils/subscribe";
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
    MenuItem
} from "@mui/material";
import {Skeleton} from "@mui/lab";
import {Add as AddIcon} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useNavigate} from "react-router-dom";
import MovieIcon from '@mui/icons-material/Movie';
import TvIcon from '@mui/icons-material/Tv';
import VideocamIcon from '@mui/icons-material/Videocam';
import DeleteDialog from "@/pages/subscribe/Custom/DeleteDialog";

function OptionMenus({onEdit, onDelete}) {
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
                <MenuItem onClick={onEdit}>
                    编辑
                </MenuItem>
                <MenuItem onClick={onDelete}>
                    删除
                </MenuItem>
            </Menu></>
    )
}

function FilterItem({name, mediaType, savePath, renameRule, torrentFilter, onEdit, onDelete}) {
    console.log(mediaType);
    return (
        <ListItem
            secondaryAction={
                <OptionMenus onEdit={onEdit} onDelete={onDelete}/>
            }
        >
            <ListItemAvatar>
                <Avatar>
                    {mediaType === 'Movie' && <MovieIcon/>}
                    {mediaType === 'TV' && <TvIcon/>}
                    {mediaType === 'Other' && <VideocamIcon/>}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={name}
                          secondary={`下载到：${savePath}`}/>
        </ListItem>
    )
}

const CustomList = () => {
    const navigate = useNavigate();
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
    const onDeleteSuccess = (res) => {
        refetchSubCustomData();
    }
    return (
        <>
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
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
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
