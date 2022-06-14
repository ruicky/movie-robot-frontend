import {Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, OutlinedInput} from "@mui/material";
import TreeView from '@mui/lab/TreeView';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import React, {useEffect, useState} from "react";
import {useGetDirs} from "@/api/CommonApi";
import message from "@/utils/message";
import {TreeItem} from "@mui/lab";
import LinesEllipsis from "react-lines-ellipsis";

function PathSelectDialog({
                              disabled = false,
                              defaultSelected,
                              rootPath = "/",
                              placeholder = "请选择路径",
                              title = "点击选择路径",
                              onChange
                          }) {
    const [inputValue, setInputValue] = useState('');
    const [open, setOpen] = useState(false);
    const [expanded, setExpanded] = useState([]);
    const [selected, setSelected] = useState([]);
    const {mutateAsync: getDirs, isLoading} = useGetDirs();
    const [treeData, setTreeData] = useState(null);
    const handleClose = () => {
        setOpen(false);
    }
    const confirmPath = (selected) => {
        setInputValue(selected);
        setOpen(false);
        if (onChange) {
            onChange(selected);
        }
    }
    const findNode = (nodes, node_id) => {
        let result = null;
        for (const node of nodes) {
            if (node.id === node_id) {
                result = node;
                break;
            }
            if (node?.children) {
                const tmp = findNode(node?.children, node_id);
                if (tmp) {
                    result = tmp;
                    break;
                }
            }
        }
        return result;
    }
    const setDirs = (path, defaultSelected = null) => {
        getDirs({path: path, defaultSelected: defaultSelected}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    if (treeData == null) {
                        setTreeData(data);
                    } else {
                        const tmp = [...treeData];
                        const node = findNode(tmp, path);
                        if (node) {
                            node.children = data;
                        }
                        setTreeData(tmp);
                    }
                    if (defaultSelected) {
                        setSelected(defaultSelected);
                    }
                } else {
                    message.error(msg)
                }
            },
            onError: error => message.error(error)
        });
    }
    const handleSelect = (event, nodeIds) => {
        setDirs(nodeIds)
        setSelected(nodeIds);
    }
    const handleToggle = (event, nodeIds) => {
        setExpanded(nodeIds);
    };
    const renderTree = (nodes) => (
        <>
            {
                nodes && nodes.map((node) => (
                    <TreeItem key={node.id} nodeId={node.id} label={node.name}>
                        {node?.children && Array.isArray(node?.children)
                            ? renderTree(node.children)
                            : null}
                    </TreeItem>
                ))
            }
        </>
    );
    useEffect(() => {
        setInputValue(defaultSelected);
        setDirs(rootPath, defaultSelected);
    }, [defaultSelected, rootPath])
    return (
        <>
            <OutlinedInput
                sx={{paddingRight: 0}}
                fullWidth
                placeholder={placeholder}
                variant="outlined"
                onClick={() => {
                    if (!disabled) {
                        setOpen(true)
                    }
                }}
                value={inputValue}
                InputProps={{
                    readOnly: true,
                }}
                disabled={disabled}
            />
            <Dialog onClose={handleClose} open={open} fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent sx={{overflow: 'hidden'}}>
                    <TreeView
                        aria-label="multi-select"
                        defaultCollapseIcon={<ExpandMoreIcon/>}
                        defaultExpandIcon={<ChevronRightIcon/>}
                        onNodeSelect={handleSelect}
                        onNodeToggle={handleToggle}
                        expanded={expanded}
                        selected={selected}
                        disableSelection={isLoading}
                        sx={{height: 260, flexGrow: 1, overflowY: 'auto'}}
                    >
                        {treeData && renderTree(treeData)}
                    </TreeView>
                    <Box sx={{my: 1}}>
                        <LinesEllipsis text={selected} maxLine={4} style={{weight: "100%"}}/>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>取消</Button>
                    <Button onClick={() => confirmPath(selected)}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default PathSelectDialog;
