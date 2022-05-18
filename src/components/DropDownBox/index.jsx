import React, {useState} from 'react';
import {Button, Menu, MenuItem} from "@mui/material";
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import { get as _get} from 'lodash';

/**
 * 下拉框组件
 * @param {Array} data {name, value} 下拉框选项
 * @param {String} value 初始值
 * @param {String} label 显示文字
 * @param {Function} onChange 选择某个选项时触发
 * @returns 组件
 */
const DropDownBox = ({data, value, label, onChange}) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
      setAnchorEl(null);
  };
  
  return (
    <>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {
          data.map(item => (
            <MenuItem onClick={() => {
              handleClose()
              onChange(item.value)
            }
            }>
              {item.name}
            </MenuItem>
          ))
        }
      </Menu>
      <Button
          edge="end"
          id="basic-button"
          aria-controls={open ? 'basic-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-haspopup="true"
          onClick={handleClick}
          endIcon={<ArrowDropDownIcon/>}
          variant="h3"
      >
        {(value !== '全部' && value) ? value : label}
      </Button>
    </>
  );
}

export default DropDownBox;