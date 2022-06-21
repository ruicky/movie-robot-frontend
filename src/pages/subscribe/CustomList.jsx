import React, {useState} from 'react';
import {Helmet} from "react-helmet-async";
import {useSubCustomList} from "@/utils/subscribe";
import {
    Avatar,
    Divider,
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
import {Skeleton} from "@mui/lab";
import {Add as AddIcon, FilterList as FilterListIcon} from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {useNavigate} from "react-router-dom";
import DeleteDialog from "@/pages/subscribe/Custom/DeleteCustomFilter";

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

function FilterItem({filterName, savePath, onEdit, onDelete}) {
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
                          secondary={"下载到：" + savePath}/>
        </ListItem>
    )
}

const CustomList = () => {
    const navigate = useNavigate();
    const {data: subCustomData, isLoading: subIsLoading, refetch: refetchSubCustomData} = useSubCustomList()
    const [deleteFilterName, setDeleteFilterName] = useState(null)
    const [deleteFilterId, setDeleteFilterId] = useState(null)
    const onEdit = (item) => {
        navigate("/subscribe/edit-custom-filter?id=" + item.id)
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
            <List sx={{mt:4,width: '100%', bgcolor: 'background.paper'}}>
                {subCustomData && subCustomData?.data ? subCustomData.data.map((item, index) => (
                    <FilterItem
                        key={index}
                        filterName={item?.filter_name}
                        savePath={item?.save_path}
                        onEdit={() => onEdit(item)}
                        onDelete={() => onDelete(item)}
                    />
                )) : <Skeleton variant="rectangular"/>}
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate("/subscribe/edit-custom-filter")}>
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
