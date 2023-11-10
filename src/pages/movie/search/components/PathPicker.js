import React, { useCallback, useEffect, useState } from "react";
import axios from "../../../../utils/request";
import FolderIcon from "@mui/icons-material/Folder";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Switch,
  Typography,
} from "@mui/material";

export const PathPicker = ({ downloadInfo, onClose: close, setMessage }) => {
  const [paths, setPaths] = useState([]);
  const [betterVersion, setBetterVersion] = useState(false);
  const [confirmPath, setConfirmPath] = useState(null);
  useEffect(() => {
    axios
      .get("/api/download/paths", {
        params: {},
      })
      .then((res) => {
        const { data } = res;
        setPaths(data);
      });
  }, []);

  const downloadRequest = useCallback(
    (path, betterVersion) => {
      const { id, site_id } = downloadInfo;
      axios
        .get("/api/download/torrent", {
          params: { id, site_id, save_path: path, better_version: betterVersion },
        })
        .then(({ code, message }) => {
          setConfirmPath(null);
          close();
          setMessage(message);
        });
    },
    [downloadInfo]
  );
  return (
    <>
      <Dialog
        open={!!confirmPath}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">确认要下载吗?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="h5">保存路径: {confirmPath}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmPath(null);
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              downloadRequest(confirmPath, betterVersion);
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!downloadInfo} onClose={close} maxWidth={"xs"} fullWidth>
        <DialogTitle>要保存到哪里？</DialogTitle>
        <List sx={{ pt: 0 }}>
          {paths.map((path, index) => (
            <ListItem key={path}>
              <ListItemButton onClick={() => setConfirmPath(path)}>
                <ListItemAvatar>
                  <FolderIcon />
                </ListItemAvatar>
                <ListItemText primary={path} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <FormControlLabel
            sx={{ ml: 3 }}
            control={
              <Switch
                checked={betterVersion}
                name="betterVersion"
                onChange={(e) => setBetterVersion(e.target.checked)}
              />
            }
            label="下载完成后自动替换掉媒体服务器的旧版"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};
