import ConfirmDialog from "@/components/ConfirmDialog";
import React, {useState} from "react";
import {FormControl, InputLabel, MenuItem, Select} from "@mui/material";

const CategorizeDialog = ({open, onClose, onOk, selectPaths}) => {
    const [linkMode, setLinkMode] = useState("link");
    const handleChange = (event) => {
        setLinkMode(event.target.value);
    };
    return (
        <ConfirmDialog
            open={open}
            onClose={onClose}
            onOk={() => onOk(selectPaths, linkMode)}
            content={<FormControl sx={{mt: 2}} fullWidth>
                <InputLabel htmlFor="max-width">转移模式</InputLabel>
                <Select
                    id="linkMode"
                    value={linkMode}
                    label="文件分类处理模式"
                    onChange={handleChange}
                    fullWidth
                >
                    <MenuItem value={"link"}>分类后硬链接到目标目录</MenuItem>
                    <MenuItem value={"copy"}>分类后复制到目标目录</MenuItem>
                    <MenuItem value={"move"}>分类后移动到目标目录</MenuItem>
                </Select>
            </FormControl>}
        >
            您选中了{selectPaths && selectPaths.length}个刮削后影片，确定要进行整理吗？整理后的目标目录将自动按区域分好文件夹（老司机的最佳实践）
        </ConfirmDialog>
    );
}
export default CategorizeDialog;