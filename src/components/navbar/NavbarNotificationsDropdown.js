import React, {useEffect, useRef, useState} from "react";
import {Link} from "react-router-dom";
import styled from "styled-components";

import {
    Avatar as MuiAvatar,
    Badge,
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Popover as MuiPopover,
    SvgIcon,
    Tooltip,
    Typography,
} from "@mui/material";
import * as f_icon from "react-feather";
import {Bell} from "react-feather";
import {countUnreadSysNotify, getUnreadSysNotify} from "@/api/UserApi";
import * as m_icon from "@mui/icons-material";
import _ from "lodash";
import {useInterval} from "@/utils/hooks";

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

function Notification({title, description, icon}) {
    const Icon = _.get({
        ...m_icon,
        ...f_icon
    }, icon, null)
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
                secondary={description}
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
    const handleOpen = async () => {
        const messageList = await getUnreadSysNotify()
        setMessageList(messageList);
        setMessageCount(messageList.length)
        setUnreadCount(0);
        setOpen(true);
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
                <IconButton color="inherit" ref={ref} onClick={handleOpen} size="large">
                    <Indicator badgeContent={unread > 0 ? unread : null}>
                        <Bell/>
                    </Indicator>
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
                            />
                        ))}
                    </List>
                    <Box p={1} display="flex" justifyContent="center">
                        <Button size="small" component={Link} to="/notify/list">
                            查看所有消息
                        </Button>
                    </Box>
                </React.Fragment>
            </Popover>
        </React.Fragment>
    );
}

export default NavbarNotificationsDropdown;
