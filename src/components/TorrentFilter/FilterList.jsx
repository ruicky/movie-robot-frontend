import {IconButton, List as MuiList, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {useEffect, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import styled from "styled-components/macro";
import {Add as AddIcon} from "@mui/icons-material";
import {EditFilterDialog} from "@/components/TorrentFilter/EditFilterDialog";
import {FilterTypes} from "@/components/TorrentFilter/constant";

const List = styled(MuiList)`
    width: 100%;
    background-color: background.paper
`

function getFilterPreview(filterType, filterData) {
    console.log(filterType, filterData);
    let desc = "";
    switch (filterType) {
        case "torrentName":
            return `条件：${filterData.logic==='and'?"并且":"或者"} 关键字：${filterData.torrent_name}`;
        case "fileSize":
            if (filterData.min_size !== 0) {
                desc += "尺寸 >=" + filterData.min_size + "MB";
            }
            if (filterData.max_size !== 0) {
                if (desc!=='') {
                    desc+=" 并且 "
                }
                desc += "尺寸 <=" + filterData.max_size + "MB";
            }
            return desc;
        case "mediaStream":
            desc += filterData.media_source.join('/') + ' - ';
            desc += filterData.resolution.join('/') + ' - ';
            desc += filterData.media_codec.join('/');
            return desc;
        case "torrentSeeders":
            return desc;
        case "subtitle":
            return "";
        case "freeDownload":
            return "";
        case "torrentHR":
            return "";
        default:
            return "";
    }
}

const FilterItem = ({name, desc, disablePadding = true, handleDelete, handleDetail}) => {
    return (<ListItem
        secondaryAction={
            <IconButton edge="end" aria-label="comments" onClick={handleDelete}>
                <DeleteIcon/>
            </IconButton>
        }
        disablePadding={disablePadding}
    >
        <ListItemButton onClick={handleDetail}>
            <ListItemText
                primary={name}
                secondary={desc}
            />
        </ListItemButton>
    </ListItem>);
}

const TorrentFilterList = ({data, handleDelete, handleSave}) => {
    const [items, setItems] = useState([]);
    const [openSelectDialog, setOpenSelectDialog] = useState({open: false, data: null});
    const showAdd = () => {
        setOpenSelectDialog({open: true, data: null});
    }
    useEffect(() => {
        if (!data) {
            return;
        }
        setItems(data.map((item) => {
            return {
                id: item.id,
                name: FilterTypes.find((x) => x.value === item.filter_type).name,
                desc: getFilterPreview(item.filter_type, item.filter_data),
                data: item
            };
        }));
    }, [data])
    return (
        <>
            <EditFilterDialog
                open={openSelectDialog.open}
                data={openSelectDialog.data}
                handleClose={() => setOpenSelectDialog({open: false, data: null})}
                handleSave={(id, val) => {
                    handleSave(id, val);
                    setOpenSelectDialog({open: false, data: null});
                }}
            />
            <List>
                {items && items.map((item, index) => (
                    <FilterItem
                        key={item.id}
                        name={item.name}
                        desc={item.desc}
                        handleDelete={() => handleDelete(item.data)}
                        handleDetail={() => {
                            setOpenSelectDialog({open: true, data: item.data});
                        }}
                    />
                ))}
                <ListItem disablePadding>
                    <ListItemButton onClick={showAdd}>
                        <ListItemIcon>
                            <AddIcon/>
                        </ListItemIcon>
                        <ListItemText primary="添加"/>
                    </ListItemButton>
                </ListItem>
            </List>
        </>
    );
}
export default TorrentFilterList;