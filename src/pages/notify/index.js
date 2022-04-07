import React from 'react';
import styled from "styled-components/macro";
import { List,ListSubheader, Grid, ListItem, Divider, ListItemText, Typography, ListItemAvatar, Avatar } from "@mui/material";



export default function Notify () {
  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}  subheader={
      <ListSubheader component="div" id="nested-list-subheader">
        通知列表
      </ListSubheader>
    }>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar sx={{bgcolor: 'info.main'}}>智</Avatar>
        </ListItemAvatar>
        <Grid container spacing={2} sx={{alignItems: 'center'}}>
          <Grid item xs={12} md={10}>
            <ListItemText
            primary="智能下载"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  INFO：
                </Typography>
                已经完成本次智能下载任务，共检索了8部资源，实际下载0部。
              </React.Fragment>
            }
          />
          </Grid>
          <Grid item xs={12} md={2} sx={{textAlign: 'right'}}>
            <ListItemText secondary="2022-01-02 17:00" />
          </Grid>
        </Grid>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar sx={{bgcolor: 'error.main'}}>系</Avatar>
        </ListItemAvatar>
        <Grid container spacing={2} sx={{alignItems: 'center'}}>
          <Grid item xs={12} md={10}>
            <ListItemText
            primary="系统消息"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                Error：
                </Typography>
                备胎下载种子需要页面确认，先手动打开浏览器下载一次，并重新换Cookie！
              </React.Fragment>
            }
          />
          </Grid>
          <Grid item xs={12} md={2} sx={{textAlign: 'right'}}>
            <ListItemText secondary="2022-01-02 17:00" />
          </Grid>
        </Grid>
      </ListItem>
      <Divider variant="inset" component="li" />
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar sx={{bgcolor: 'info.main'}}>站</Avatar>
        </ListItemAvatar>
        <Grid container spacing={2} sx={{alignItems: 'center'}}>
          <Grid item xs={12} md={10}>
            <ListItemText
            primary="站点管理"
            secondary={
              <React.Fragment>
                <Typography
                  sx={{ display: 'inline' }}
                  component="span"
                  variant="body2"
                  color="text.primary"
                >
                  INFO：
                </Typography>
                柠檬;阿童木;备胎等站点的 COOKIE 信息已过期，请注意关注，并替换新的信息。
              </React.Fragment>
            }
          />
          </Grid>
          <Grid item xs={12} md={2} sx={{textAlign: 'right'}}>
            <ListItemText secondary="2022-01-02 17:00" />
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}