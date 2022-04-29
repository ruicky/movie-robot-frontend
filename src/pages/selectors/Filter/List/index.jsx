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
    Typography
} from "@mui/material";
import {Add as AddIcon, FilterList as FilterListIcon} from "@mui/icons-material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

import React, {useEffect, useState} from "react";
import {Skeleton} from "@mui/lab";
import {getFilterConfigList} from "@/api/ConfigApi";
import {useNavigate} from "react-router-dom";
import DeleteDialog from "@/pages/selectors/Filter/Delete";

function FilterItem({filterName, mediaType, cate, area, onEdit, onDelete}) {
    const mediaTypeMapping = {"Movie": "电影", "TV": "剧集"}
    if (mediaType) {
        for (let i = 0; i < mediaType.length; i++) {
            mediaType[i] = mediaTypeMapping[mediaType[i]];
        }
    }
    return (
        <ListItem
            secondaryAction={
                <OptionMenus onEdit={onEdit} onDelete={onDelete}/>
            }
        >
            <ListItemAvatar>
                <Avatar>
                    <FilterListIcon/>
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={filterName}
                          secondary={mediaType ? (mediaType.join(" ") + " ") : "" + cate.join(" / ") + " " + area.join(" / ")}/>
        </ListItem>
    )
}

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

function FilterList() {
    const navigate = useNavigate();
    const [list, setList] = useState(null)
    const [deleteFilterName, setDeleteFilterName] = useState(null)
    const fetchList = () => {
        getFilterConfigList().then(r => {
            if (r.code === 0) {
                setList(r.data)
            }
        })
    }
    useEffect(() => {
        fetchList()
    }, [])
    const onEdit = (filterName) => {
        navigate("/smartDownload/edit-filter?filterName=" + filterName)
    }
    const onDelete = (filterName) => {
        setDeleteFilterName(filterName)
    }
    const onDeleteSuccess = (res) => {
        fetchList()
    }
    return (
        <>
            <Typography sx={{mt: 4, mb: 2}} variant="h6" component="div">
                过滤器
            </Typography>
            <DeleteDialog
                open={!!deleteFilterName}
                handleClose={() => setDeleteFilterName(null)}
                filterName={deleteFilterName}
                onSuccess={onDeleteSuccess}
            />
            <List sx={{width: '100%', bgcolor: 'background.paper'}}>
                {list ? list.map((item) => (
                    <FilterItem
                        key={item?.filter_name}
                        filterName={item?.filter_name}
                        mediaType={item?.apply_media_type}
                        cate={item?.apply_cate}
                        area={item?.apply_area}
                        onEdit={() => onEdit(item?.filter_name)}
                        onDelete={() => onDelete(item?.filter_name)}
                    />
                )) : <Skeleton variant="rectangular"/>}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/smartDownload/edit-filter")}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary="添加"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    )
}

export default FilterList;