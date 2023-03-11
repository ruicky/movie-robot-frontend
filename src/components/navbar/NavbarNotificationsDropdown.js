import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {
    Avatar as MuiAvatar,
    Badge,
    Box,
    Button,
    CircularProgress,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover as MuiPopover,
    SvgIcon,
    Tooltip,
    Typography
} from "@mui/material";
import * as f_icon from "react-feather";
import {Bell} from "react-feather";
import {countUnreadSysNotify, getUnreadSysNotify} from "@/api/UserApi";
import * as m_icon from "@mui/icons-material";
import {get as _get} from "lodash-es";
import {useInterval} from "@/utils/hooks";
import MessageAction from "@/pages/notify/actions";

const Popover = styled(MuiPopover)`
  .MuiPaper-root {
    width: 300px;
    ${(props) => props.theme.shadows[1]};
    border: 1px solid ${(props) => props.theme.palette.divider};
  }
`;

const Indicator = styled(Badge)`
  .MuiBadge-badge {
    background: ${(props) => props.theme.header.indicator.background};
    color: ${(props) => props.theme.palette.common.white};
  }
`;

const Avatar = styled(MuiAvatar)`
  background: ${(props) => props.theme.palette.primary.main};
`;

const NotificationHeader = styled(Box)`
  text-align: center;
  border-bottom: 1px solid ${(props) => props.theme.palette.divider};
`;

function Notification({title, description, icon, type, args, hasAction, actionLog, onRefresh = null}) {
    const Icon = _get({
        ...m_icon,
        ...f_icon
    }, icon, null);
    return (
        <ListItem divider component={Link} to="#">
            <ListItemAvatar>
                <Avatar>
                    <SvgIcon fontSize="small">
                        <Icon/>
                    </SvgIcon>
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={title}
                primaryTypographyProps={{
                    variant: "subtitle2",
                    color: "textPrimary",
                }}
                secondary={<MessageAction type={type} args={args} has_action={hasAction} action_log={actionLog}
                                          description={description} onSuccess={onRefresh}/>}
            />

        </ListItem>
    );
}

function NavbarNotificationsDropdown() {
    const ref = useRef(null);
    const [isOpen, setOpen] = useState(false);
    const [unread, setUnreadCount] = useState(0)
    const [messageCount, setMessageCount] = useState(0)
    const [messageList, setMessageList] = useState([])
    const [loading, setLoading] = useState(false)

    const handleOpen = async () => {
        setLoading(true)
        try {
            const messageList = await getUnreadSysNotify()
            setMessageList(messageList);
            setMessageCount(messageList.length)
            setUnreadCount(0);
            setOpen(true);
        } catch (error) {
            console.error(error)
        }
        setLoading(false)
    };
    const countMessage = async () => {
        const count = await countUnreadSysNotify();
        if (count) {
            setUnreadCount(count)
        }
    }
    const handleClose = () => {
        setOpen(false);
    };
    useEffect(() => {
        countMessage()
    }, [])
    useInterval(countMessage, 10000)
    return (
        <React.Fragment>
            <Tooltip title="通知消息">
                <IconButton disabled={loading} component="div" color="inherit" ref={ref} onClick={handleOpen}
                            size="large">
                    {loading ? <CircularProgress size={24} color="primary"/> :
                        <Indicator badgeContent={unread > 0 ? unread : null}>
                            <Bell/>
                        </Indicator>}
                </IconButton>
            </Tooltip>
            <Popover
                anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                }}
                anchorEl={ref.current}
                onClose={handleClose}
                open={isOpen}
            >
                <NotificationHeader p={2}>
                    <Typography variant="subtitle1" color="textPrimary">
                        {messageCount > 0 ? "最近" + messageCount + "条未读消息" : "没有未读消息"}
                    </Typography>
                </NotificationHeader>
                <React.Fragment>
                    <List disablePadding>
                        {messageList && messageList.map((item) => (
                            <Notification
                                key={item.id}
                                title={item.title}
                                description={item.message}
                                icon={item.icon}
                                type={item.type}
                                args={item.args ? JSON.parse(item.args) : null}
                                hasAction={item.has_action}
                                actionLog={item.action_log}
                                onRefresh={() => {
                                    const tmp = [...messageList];
                                    for (let i of tmp) {
                                        if (i.id === item.id) {
                                            i.action_log = '已处理';
                                        }
                                    }
                                    setMessageList(tmp);
                                }}
                            />
                        ))}
                    </List>
                    <Box p={1} display="flex" justifyContent="center">
                        <Button size="small" onClick={handleClose} component={Link} to="/notify/list">
                            查看所有消息
                        </Button>
                    </Box>
                </React.Fragment>
            </Popover>
        </React.Fragment>
    );
}

export default NavbarNotificationsDropdown;
