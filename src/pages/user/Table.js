import React from "react";
import styled from "styled-components/macro";
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Card as MuiCard,
    CardHeader,
    Chip as MuiChip,
    Divider,
    IconButton,
    Paper as MuiPaper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from "@mui/material";
import message from "@/utils/message";
import {spacing} from "@mui/system";
import {Add, Edit} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useDeleteUser} from "@/api/UserApi";

const Card = styled(MuiCard)(spacing);

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 90%;
  background-color: ${(props) =>
    props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
`;

const Paper = styled(MuiPaper)(spacing);

const TableWrapper = styled.div`
  overflow-y: auto;
  max-width: calc(100vw - ${(props) => props.theme.spacing(12)});
`;
const getRole = (roleCode) => {
    if (roleCode === 1) {
        return (<Chip label="管理员" color="success"/>)
    } else if (roleCode === 2) {
        return (<Chip label="用户" color="success"/>)
    }
}
const UserTable = ({data, refetch}) => {
    const {mutate: deleteUser} = useDeleteUser();
    const onDelete = (uid) => {
        deleteUser({
            uid
        }, {
            onSuccess: res => {
                const {data, code, message: msg} = res;
                if (code === 0) {
                    message.success(msg);
                    refetch();
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        })
    }
    return (
        <Card mb={6}>
            <CardHeader
                action={
                    <Stack direction="row" divider={<Divider orientation="vertical" flexItem/>} spacing={1}>
                        <IconButton color="info" aria-label="添加" size="large" component={Link} to={"/user/edit?op=add"}>
                            <Add/>
                        </IconButton>
                    </Stack>
                }
                title="全部用户"
            />
            <Paper>
                <TableWrapper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>昵称</TableCell>
                                <TableCell>用户名</TableCell>
                                <TableCell>角色</TableCell>
                                <TableCell>选种</TableCell>
                                <TableCell>豆瓣</TableCell>
                                <TableCell>微信</TableCell>
                                <TableCell>PushDeer</TableCell>
                                <TableCell>Bark</TableCell>
                                <TableCell>操作</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                        {row.nickname}
                                    </TableCell>
                                    <TableCell>{row.username}</TableCell>
                                    <TableCell>{getRole(row.role)}</TableCell>
                                    <TableCell>{row.score_rule_name ? row.score_rule_name : "未设置"}</TableCell>
                                    <TableCell>{row.douban_user ? row.douban_user : "未设置"}</TableCell>
                                    <TableCell>{row.qywx_user ? row.qywx_user : "未设置"}</TableCell>
                                    <TableCell>{row.pushdeer_key ? "已设置" : "未设置"}</TableCell>
                                    <TableCell>{row.bark_url ? "已设置" : "未设置"}</TableCell>
                                    <TableCell>
                                        <Stack direction="row">
                                            <IconButton
                                                // color="info"
                                                aria-label="编辑"
                                                size="small"
                                                component={Link}
                                                to={"/user/edit?op=edit&id=" + row.id}
                                            >
                                                <Edit/>
                                            </IconButton>
                                            {row.id !== 1 && <IconButton
                                                // color="info"
                                                aria-label="删除"
                                                size="small"
                                                onClick={(e) => onDelete(row.id)}
                                            >
                                                <DeleteIcon/>
                                            </IconButton>}
                                        </Stack>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableWrapper>
            </Paper>
        </Card>
    )
};

export default UserTable;
