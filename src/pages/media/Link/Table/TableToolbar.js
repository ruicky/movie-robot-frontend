import {Button, Stack, Toolbar, Tooltip, Typography} from "@mui/material";
import {alpha} from "@mui/material/styles";
import React from "react";
import styled from "styled-components/macro";

const Spacer = styled.div`
  flex: 1 1 100%;
`;

function TableToolbar(props) {
    const {numSelected, onLink, onCorrect, onTools, onCategorize} = props;

    return (
        <Toolbar sx={{
            pl: {sm: 2},
            pr: {xs: 1, sm: 1},
            ...(numSelected > 0 && {
                bgcolor: (theme) =>
                    alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
            }),
        }}>
            {numSelected > 0 ? (
                <Typography color="inherit" variant="subtitle1" width={120}>
                    选中{numSelected}个
                </Typography>
            ) : (
                <Typography variant="h6" id="tableTitle" width={120}>
                    本地资源
                </Typography>
            )}
            <Spacer/>
            {numSelected > 0 ? (
                <Stack direction="row" spacing={2}>
                    <Tooltip title="一些内置小工具">
                        <Button variant="contained" onClick={onTools}>
                            修复原盘
                        </Button>
                    </Tooltip>
                    <Tooltip title="自动对选中的资源，原样重新分类">
                        <Button variant="contained" onClick={onCategorize}>
                            自动分类
                        </Button>
                    </Tooltip>
                    <Tooltip title="对识别错误的资源，输入准确信息后重新整理">
                        <Button variant="contained" onClick={onCorrect}>
                            识别纠错
                        </Button>
                    </Tooltip>
                    <Tooltip title="开始分析选中的资源影视信息，然后整理到对应目录">
                        <Button variant="contained" onClick={onLink}>
                            识别整理
                        </Button>
                    </Tooltip>
                </Stack>
            ) : null}
        </Toolbar>
    );
};
export default TableToolbar;