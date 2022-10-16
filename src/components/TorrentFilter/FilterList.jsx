import {IconButton, List as MuiList, ListItem, ListItemButton, ListItemIcon, ListItemText} from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
import DeleteIcon from '@mui/icons-material/Delete';
import styled from "styled-components/macro";
import {Add as AddIcon} from "@mui/icons-material";
import {EditFilterDialog} from "@/components/TorrentFilter/EditFilterDialog";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";
import {FilterTypes} from "@/components/TorrentFilter/Filters";

const List = styled(MuiList)`
    width: 100%;
    background-color: background.paper
`

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
    const filterOptions = useContext(FilterOptionsContext);
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
            const filter = FilterTypes.find((val) => val.value === item.filter_type);
            return {
                id: item.id,
                name: filter.name,
                desc: filter.filter.preview(item.filter_data, filterOptions),
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