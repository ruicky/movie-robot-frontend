import React from "react";
import {
  ListItemIcon,
  ListItemText as MuiListItemText,
  Menu,
  MenuItem,
  Paper as MuiPaper,
} from "@mui/material";
import {
  AutorenewOutlined as AutorenewOutlinedIcon,
  DoneOutlined as DoneOutlinedIcon,
} from "@mui/icons-material";
import styled from "styled-components/macro";

const ChoiceMenu = ({ open, onClose, anchorEl }) => {
  return (
    <Paper>
      <Menu
        open={open}
        onClose={onClose}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <MenuItem aria-label="菜单-转换">
          <ListItemText>转换</ListItemText>
          <ListItemIcon>
            <AutorenewOutlinedIcon />
          </ListItemIcon>
        </MenuItem>
        <MenuItem aria-label="菜单-标记已播放">
          <ListItemText>标记已播放</ListItemText>
          <ListItemIcon>
            <DoneOutlinedIcon />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </Paper>
  );
};

const Paper = styled(MuiPaper)``;

const ListItemText = styled(MuiListItemText)`
  min-width: 80px;
`;

export default ChoiceMenu;
