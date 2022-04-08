import React from 'react';
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogContentText,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  Typography,
  ListItemText,
  Grid
}from "@mui/material";

import { Info as InfoIcon} from '@mui/icons-material';

function InfoList () {
  return (
    <List dense>
      <ListItem>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography>名称：</Typography>
          </Grid>
          <Grid item xs={9}>
            <ListItemText>沉默的真相</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography>种子名称：</Typography>
          </Grid>
          <Grid item xs={9}>
            <ListItemText>The.Long.Night.2020.WEB-DL.4k.H265.AAC-Enichi</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
      <ListItem>
        <Grid container spacing={2}>
          <Grid item xs={3}>
            <Typography>多字数测试多字数测试多字数测试：</Typography>
          </Grid>
          <Grid item xs={9}>
            <ListItemText>多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；多字数测试；</ListItemText>
          </Grid>
        </Grid>
      </ListItem>
    </List>
  );
}

export default function MovieInfoDialog () {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    console.log('handleClickOpen');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return(
    <div>
      <IconButton onClick={handleClickOpen} aria-label="信息" size="small">
        <InfoIcon/>
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll='paper'
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        sx={{minWidth: '600'}}
      >
        <DialogTitle id="scroll-dialog-title">信息</DialogTitle>
        <DialogContent dividers sx={{padding: 0}}>
          <InfoList />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>关闭</Button>
        </DialogActions>
      </Dialog>
    </div>
    
  );
}
