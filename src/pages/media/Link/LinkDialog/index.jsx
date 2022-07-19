import ConfirmDialog from "@/components/ConfirmDialog";
import React, {useState} from "react";
import {Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";

const LinkDialog = ({open, onClose, onOk, selectPaths}) => {
    const [linkMode, setLinkMode] = useState("link");
    const [autoSearchDouban, setAutoSearchDouban] = useState(false);
    const handleChange = (event) => {
        setLinkMode(event.target.value);
    };
    return (
        <ConfirmDialog
            open={open}
            onClose={onClose}
            onOk={() => onOk(selectPaths, linkMode, autoSearchDouban)}
            content={<>
                <FormControl sx={{mt: 2}} fullWidth>
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
                </FormControl>
                <FormControlLabel
                    control={<Checkbox
                        checked={autoSearchDouban}
                        onChange={(event => setAutoSearchDouban(event.target.checked))}
                        name="autoSearchDouban"
                    />}
                    label="自动搜索豆瓣元数据（数量多时可能会非常慢）"
                />
            </>}
        >
            您选中了{selectPaths && selectPaths.length}个影片进行刮削，确定要立即开始吗？
        </ConfirmDialog>
    );
}
export default LinkDialog;