import * as React from "react";
import styled from "styled-components/macro";
import {useNavigate} from "react-router-dom";

import {IconButton as MuiIconButton, Menu, MenuItem, Tooltip,} from "@mui/material";


import useAuth from "@/hooks/useAuth";
import {MoreVert} from "@mui/icons-material";
import axios from "@/utils/request";

import useStore from "@/store/index";
import msg from "@/utils/message";

const IconButton = styled(MuiIconButton)`
  svg {
    width: 22px;
    height: 22px;
  }
`;

function NavbarUserDropdown() {
    const [anchorMenu, setAnchorMenu] = React.useState(null);
    const navigate = useNavigate();
    const {signOut} = useAuth();

    const theme = useStore(state => state.theme)

    const toggleMenu = (event) => {
        setAnchorMenu(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorMenu(null);
    };

    const handleSignOut = async () => {
        await signOut();
        navigate("/auth/sign-in");
    };
    const runTaskNow = (name) => {
        axios
            .get("/api/task/run", {
                params: {
                    name: name,
                },
            })
            .then(({code, message}) => {
                msg.success(message)
                closeMenu()
            });
    }

    return (
        <React.Fragment>
            <Tooltip title="系统">
                <IconButton
                    aria-owns={Boolean(anchorMenu) ? "menu-appbar" : undefined}
                    aria-haspopup="true"
                    onClick={toggleMenu}
                    color="inherit"
                    size="large"
                >
                    <MoreVert/>
                </IconButton>
            </Tooltip>
            <Menu
                id="menu-appbar"
                anchorEl={anchorMenu}
                open={Boolean(anchorMenu)}
                onClose={closeMenu}
            >
                <MenuItem onClick={() => {
                    theme.toggle(true);
                    closeMenu()
                }}>更换主题</MenuItem>
                <MenuItem onClick={() => runTaskNow('smart_download_task')}>执行智能下载任务</MenuItem>
                <MenuItem onClick={() => runTaskNow('free_download_task')}>执行免费种子拉取</MenuItem>
                <MenuItem onClick={handleSignOut}>退出</MenuItem>
            </Menu>
        </React.Fragment>
    );
}

export default NavbarUserDropdown;
