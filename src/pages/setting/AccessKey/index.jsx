import {Helmet} from "react-helmet-async";
import {
    Avatar,
    Breadcrumbs,
    Divider as MuiDivider,
    IconButton,
    Link,
    ListItem,
    ListItemAvatar,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Typography
} from "@mui/material";
import {NavLink} from "react-router-dom";
import React, {useState} from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import List from "@mui/material/List";
import KeyIcon from '@mui/icons-material/Key';
import DeleteIcon from '@mui/icons-material/Delete';
import {useCreateAccessKey, useDeleteAccessKey, useListAccessKey} from "@/api/AuthApi";
import {Add as AddIcon} from "@mui/icons-material";
import {AddDialog} from "@/pages/setting/AccessKey/AddDialog";
import message from "@/utils/message";

const Divider = styled(MuiDivider)(spacing);
const AccessKey = () => {
    const {data: akList, refetch} = useListAccessKey();
    const {mutate: create, isLoading: creating} = useCreateAccessKey();
    const {mutate: deleteAk, isLoading: deleting} = useDeleteAccessKey();
    const [showAdd, setShowAdd] = useState(false);
    const onAdd = (bindUid) => {
        create({
            bind_uid: bindUid
        }, {
            onSuccess: res => {
                const {code, message: msg} = res;
                if (code === 0) {
                    message.success(msg);
                    refetch();
                    setShowAdd(false);
                } else {
                    message.error(msg);
                }
            }
        })
    }
    const onDelete = (akId) => {
        deleteAk({
            id: akId
        }, {
            onSuccess: res => {
                const {code, message: msg} = res;
                if (code === 0) {
                    message.success(msg);
                    refetch();
                    setShowAdd(false);
                } else {
                    message.error(msg);
                }
            }
        })
    }
    return <React.Fragment>
        <Helmet title="API密钥管理"/>
        <Typography variant="h3" gutterBottom display="inline">
            API密钥管理
        </Typography>

        <Breadcrumbs aria-label="Breadcrumb" mt={2}>
            <Link component={NavLink} to="/setting/index">
                设置
            </Link>
            <Typography>API密钥管理</Typography>
        </Breadcrumbs>
        <Divider my={4}/>
        <AddDialog
            open={showAdd}
            handleClose={() => setShowAdd(false)}
            handleSubmit={onAdd}
            submitting={creating}
        />
        <List>
            {akList?.data && akList.data.map((item) => <ListItem key={item.id}
                                                                 secondaryAction={
                                                                     <IconButton onClick={() => onDelete(item.id)}>
                                                                         <DeleteIcon/>
                                                                     </IconButton>
                                                                 }
            >
                <ListItemAvatar>
                    <Avatar>
                        <KeyIcon/>
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary={item.access_key}
                    secondary={<Typography color="text.secondary">
                        绑定用户 {item.nickname}
                    </Typography>}
                />
            </ListItem>)}
            <ListItem disablePadding>
                <ListItemButton onClick={() => setShowAdd(true)}>
                    <ListItemIcon>
                        <AddIcon/>
                    </ListItemIcon>
                    <ListItemText primary="新建API密钥"/>
                </ListItemButton>
            </ListItem>
        </List>
    </React.Fragment>;
}
export default AccessKey;