import React, {useState} from "react";
import styled from "styled-components/macro";
import CircularProgress from '@mui/material/CircularProgress';
import {alpha} from '@mui/material/styles';
import {
    Breadcrumbs as MuiBreadcrumbs,
    Button,
    Checkbox,
    Chip as MuiChip,
    Divider as MuiDivider,
    Paper as MuiPaper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    Toolbar,
    Tooltip,
    Typography,
} from "@mui/material";
import {spacing} from "@mui/system";
import {useLinkMedia} from "@/api/MediaServerApi";
import message from "@/utils/message";
import CorrectDialog from "@/pages/media/Link/CorrectDialog";

const Divider = styled(MuiDivider)(spacing);

const Breadcrumbs = styled(MuiBreadcrumbs)(spacing);

const Paper = styled(MuiPaper)(spacing);

const Spacer = styled.div`
  flex: 1 1 100%;
`;
const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;
const getStatus = (status) => {
    if (status === 0) {
        return (<Chip label="待识别" color="primary"/>)
    } else if (status === 1) {
        return (<Chip label="处理中" color="secondary"/>)
    } else if (status === 2) {
        return (<Chip label="整理完成" color="success"/>)
    } else if (status === 3) {
        return (<Chip label="识别失败" color="error"/>)
    } else {
        return (<Chip label="未知" color="warning"/>)
    }
}

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => ({
        el,
        index,
    }));
    stabilizedThis.sort((a, b) => {
        const order = comparator(a.el, b.el);
        if (order !== 0) return order;
        return a.index - b.index;
    });
    return stabilizedThis.map((element) => element.el);
}

const headCells = [
    {
        id: "name",
        numeric: false,
        disablePadding: true,
        label: "名称", sort: true
    },
    {id: "is_disc", numeric: true, disablePadding: false, label: "原盘", sort: true},
    {id: "media_type", numeric: true, disablePadding: false, label: "类型", sort: true},
    {id: "media_name", numeric: true, disablePadding: false, label: "影片名", sort: true},
    {id: "release_date", numeric: true, disablePadding: false, label: "发行日期", sort: true},
    {id: "status", numeric: true, disablePadding: false, label: "状态", sort: true},
];

const EnhancedTableHead = (props) => {
    const {
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
        disabled
    } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{"aria-label": "select all desserts"}}
                        disabled={disabled}
                    />
                </TableCell>
                {headCells.map((headCell) => (
                    <TableCell
                        key={headCell.id}
                        align={headCell.numeric ? "right" : "left"}
                        padding={headCell.disablePadding ? "none" : "normal"}
                        sortDirection={orderBy === headCell.id ? order : false}
                    >
                        {headCell.sort ? <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : "asc"}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                        </TableSortLabel> : headCell.label}
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
};

const EnhancedTableToolbar = (props) => {
    // Here was 'let'
    const {numSelected, onLink, onCorrect} = props;

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
                        <Button variant="contained" onClick={onCorrect}>
                            工具
                        </Button>
                    </Tooltip>
                    <Tooltip title="对识别错误的资源，输入准确信息后重新整理">
                        <Button variant="contained" onClick={onCorrect}>
                            纠错
                        </Button>
                    </Tooltip>
                    <Tooltip title="开始分析选中的资源影视信息，然后整理到对应目录">
                        <Button variant="contained" onClick={onLink}>
                            整理
                        </Button>
                    </Tooltip>
                </Stack>
            ) : null}
        </Toolbar>
    );
};

function MediaTable({rows, isLoading, path, linkPath, mediaType, onLinkStart = null, disabled = false}) {
    const [order, setOrder] = React.useState("desc");
    const [orderBy, setOrderBy] = React.useState("status");
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const {mutateAsync: linkMedia, isLinking} = useLinkMedia();
    const [correctDialogData, setCorrectDialogData] = useState({open: false});
    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (disabled) {
            return;
        }
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.path);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, path) => {
        if (disabled) {
            return;
        }
        const selectedIndex = selected.indexOf(path);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, path);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };
    const isSelected = (name) => selected.indexOf(name) !== -1;
    const emptyRows =
        rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);
    const onLink = () => {
        if (!linkPath) {
            message.error('请选择整理后的路径，才能开始整理！')
            return;
        }
        if (path === linkPath) {
            message.error('整理后的目标路径最好和原始分开！')
            return;
        }
        if (onLinkStart) {
            onLinkStart(selected);
        }
        linkMedia({paths: selected, root_path: path, media_type: mediaType, link_path: linkPath}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    message.success(msg)
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        })
    }
    const onCorrect = () => {
        if (!linkPath) {
            message.error('请选择整理后的路径，才能开始整理！')
            return;
        }
        if (path === linkPath) {
            message.error('整理后的目标路径最好和原始分开！')
            return;
        }
        setCorrectDialogData({
            open: true,
            path: selected,
            mediaType: mediaType
        })
    }
    const onCorrectSubmit = (values) => {
        if (onLinkStart) {
            onLinkStart(selected);
        }
        linkMedia({
            tmdb_id: values.tmdbId,
            media_name: values.name,
            media_year: values.year,
            paths: values.path,
            root_path: path,
            media_type: values.mediaType,
            link_path: linkPath,
            season_inbdex: values.seasonIndex
        }, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    message.success(msg)
                    setCorrectDialogData({open: false});
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        })
    }
    return (
        <Paper>
            <CorrectDialog data={correctDialogData} setData={setCorrectDialogData} onSubmit={onCorrectSubmit}/>
            <EnhancedTableToolbar numSelected={selected.length} onLink={onLink} onCorrect={onCorrect}/>
            <TableContainer>
                <Table
                    aria-labelledby="tableTitle"
                    size="medium"
                    aria-label="enhanced table"
                >
                    <EnhancedTableHead
                        numSelected={selected.length}
                        order={order}
                        orderBy={orderBy}
                        onSelectAllClick={handleSelectAllClick}
                        onRequestSort={handleRequestSort}
                        rowCount={rows.length}
                        disabled={disabled}
                    />
                    <TableBody>
                        {
                            isLoading && <TableRow>
                                <TableCell colspan={7} align={'center'} sx={{border: 'none'}}>
                                    <CircularProgress/>
                                </TableCell>
                            </TableRow>
                        }
                        {!isLoading && stableSort(rows, getComparator(order, orderBy))
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, index) => {
                                const isItemSelected = isSelected(row.path);
                                const labelId = `enhanced-table-checkbox-${index}`;

                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, row.path)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={row.name}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox
                                                checked={isItemSelected}
                                                inputProps={{"aria-labelledby": labelId}}
                                                disabled={disabled}
                                            />
                                        </TableCell>
                                        <TableCell
                                            component="th"
                                            id={labelId}
                                            scope="row"
                                            padding="none"
                                        >
                                            <Tooltip title={row.path} arrow>
                                                <Button variant="text">{row.name}</Button>
                                            </Tooltip>
                                        </TableCell>
                                        <TableCell
                                            align="right">{row.is_disc?row.disc_type:"不是"}</TableCell>
                                        <TableCell
                                            align="right">
                                            {row.media_type === undefined || row.media_type == null || row.media_type === '未知' && "未知"}
                                            {row.media_type === "Movie" && "电影"}
                                            {row.media_type === "TV" && "剧集"}
                                        </TableCell>
                                        <TableCell
                                            align="right">{row.media_name}</TableCell>
                                        <TableCell
                                            align="right">{row.release_date}</TableCell>
                                        <TableCell align="right">
                                            {row.err_msg ? <Tooltip
                                                title={row.err_msg}
                                                arrow>{getStatus(row.status)}</Tooltip> : getStatus(row.status)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        {emptyRows > 0 && (
                            <TableRow style={{height: (53) * emptyRows}}>
                                <TableCell colSpan={6}/>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    );
}

export default MediaTable;
