import React, { useState, useEffect } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";
import axios from "../../../utils/request";
import {
  Button,
  Card as MuiCard,
  CardActions,
  CardContent as MuiCardContent,
  CardMedia as MuiCardMedia,
  Chip as MuiChip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider as MuiDivider,
  Grid,
  LinearProgress as MuiLinearProgress,
  Snackbar,
  Typography as MuiTypography,
  Stack, CardActionArea
} from "@mui/material";
import { spacing } from "@mui/system";
import { ArrowDown, ArrowUp } from "react-feather";
import ReAnalyze from "./ReAnalyze";

const Card = styled(MuiCard)(spacing);

const CardContent = styled(MuiCardContent)`
  border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]};
`;

const CardMedia = styled(MuiCardMedia)`
  height: 220px;
`;

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);
const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;
const IconHolder = styled.span`
  display: flex;
  padding-right: ${(props) => props.theme.spacing(2)};

  svg {
    width: 14px;
    height: 14px;
  }
`;
const LinearProgress = styled(MuiLinearProgress)(spacing);
const Record = ({
                  handleDeleteRecordClickOpen,
                  id,
                  image,
                  title,
                  tname,
                  site_name,
                  year,
                  description,
                  chip,
                  status_code,
                  showAnalyze,
                  downloading,
                  resolution,
                  media_source,
                  media_encoding,
                  url
                }) => {
  let itemDownloading = { progress: 0 };
  if (id in downloading) {
    itemDownloading = downloading[id];
  }
  return (<Card>
    {image ?
      <CardActionArea target="_blank" href={url}><CardMedia image={image} title={title} /></CardActionArea> : null}
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        {title ? title + "(" + year + ")" : null}
      </Typography>
      <Typography mb={2} color="h5" component="h2">
        {site_name !== "unknown" ? "[" + site_name + "]" : ""}{tname}
      </Typography>
      {status_code === 0 ? <div><LinearProgress my={2} variant="determinate" value={itemDownloading.progress} />
        <Grid mb={2} container alignItems="center" spacing={1}>
          <Grid item>
            {itemDownloading.dlspeed_str}
          </Grid>
          <Grid item>
            <IconHolder>
              <ArrowDown />
            </IconHolder>
          </Grid>
          <Grid item>
            {itemDownloading.upspeed_str}
          </Grid>
          <Grid item>
            <IconHolder>
              <ArrowUp />
            </IconHolder>
          </Grid>
          <Grid item>
            {itemDownloading.size_str}
          </Grid>
        </Grid>
      </div> : null}
      <Stack direction="row" spacing={1}>
        {status_code !== 0 ? chip : null}
        {media_source ? <Chip label={media_source} color="primary" /> : null}
        {resolution ? <Chip label={resolution} color="success" /> : null}
        {media_encoding ? <Chip label={media_encoding} color="info" /> : null}
      </Stack>
      <Typography mb={1} color="textSecondary" component="p">
        {description}
      </Typography>
    </CardContent>
    <CardActions>
      {status_code !== 2 ?
        <Button size="small" color="primary" onClick={() => showAnalyze({ open: true, year: year, id: id })}>
          重新识别
        </Button> : null}
      <Button size="small" color="primary" onClick={() => handleDeleteRecordClickOpen(id)}>
        删除
      </Button>
    </CardActions>
  </Card>);
};

const DeleteRecord = ({ deleteRecord, handleOk, handleClose }) => {
  return (<Dialog
    open={deleteRecord !== 0}
    onClose={handleClose}
    aria-labelledby="alert-dialog-title"
    aria-describedby="alert-dialog-description"
  >
    <DialogTitle id="alert-dialog-title">
      {"真的要删除吗?"}
    </DialogTitle>
    <DialogContent>
      <DialogContentText id="alert-dialog-description">
        删除下载记录后，有一定可能性会导致智能下载时，下到重复的电影。这个删除操作，会同时删除下载任务和对应文件！
      </DialogContentText>
    </DialogContent>
    <DialogActions>
      <Button onClick={() => handleOk(deleteRecord)} color="primary" autoFocus>
        确认
      </Button>
      <Button onClick={handleClose} color="primary">
        取消
      </Button>
    </DialogActions>
  </Dialog>);
};

function DownloadRecords(props) {
  const StatusMap = {
    0: {
      msg: "下载中", color: "primary"
    }, 1: {
      msg: "下载完成", color: "success"
    }, 2: {
      msg: "下载被删", color: "error"
    }, 3: {
      msg: "未能识别", color: "warning"
    }
  };
  const handleDeleteRecordClickOpen = (id) => {
    setDeleteRecordId(id);
  };
  const handleDeleteRecordClose = () => {
    setDeleteRecordId(0);
  };
  const handleDeleteRecordOk = (id) => {
    axios.get("/api/download/delete_record", {
      params: { id: id }
    }).then((res) => {
      for (let i = 0; i < records.length; i++) {
        let r = records[i];
        if (r.id === id) {
          records.splice(i, 1);
          break;
        }
      }
      setRecords(records);
      setDeleteRecordId(0);
    });
  };
  const [message, setMessage] = React.useState();
  const [deleteRecordId, setDeleteRecordId] = useState(0);
  const [analyze, setAnalyze] = useState({ open: false, year: "", id: undefined });
  const [records, setRecords] = useState([]);
  const [downloading, setDownloading] = useState({});

  const refreshDownloading = (hashResult) => {
    axios.get("/api/download/downloading").then((res) => {
      if (!res.error) {
        let dd = {};
        if (!Object.keys(res.data).includes("data")) {
          refreshDownloadRecord();
          return;
        }
        for (let r of res.data.data) {
          if (r.hash in hashResult) {
            dd[hashResult[r.hash].id] = r;
          }
        }
        if (Object.keys(dd).length > 0) {
          setDownloading(dd);
          setTimeout(refreshDownloading, 1500, hashResult);
        } else {
          setTimeout(refreshDownloadRecord, 1500);
        }
      }
    });
  };
  const refreshDownloadRecord = () => {
    axios.get("/api/download/record_list").then((res) => {
      let result = [];
      let hashResult = {};
      let dlCount = 0;
      for (let r of res.data.data) {
        let desc;
        if (r.desc && r.desc.length > 100) {
          desc = r.desc.substring(0, 100) + "...";
        } else {
          desc = r.desc;
        }
        if (r.download_status === 3) {
          desc = r.torrent_subject;
        }
        if (r.download_status === 0) {
          dlCount++;
        }
        let item = {
          id: r.id,
          name: r.movie_name,
          tname: r.torrent_name,
          site_name: r.site_name,
          thumb_image_url: r.thumb_image_url,
          status: StatusMap[r.download_status].msg,
          status_color: StatusMap[r.download_status].color,
          status_code: r.download_status,
          desc: desc,
          year: r.movie_year,
          hash: r.torrent_hash,
          media_source: r.media_source,
          resolution: r.resolution,
          media_encoding: r.media_encoding,
          url: r.url
        };
        hashResult[r.torrent_hash] = item;
        result.push(item);
      }
      if (dlCount > 0) {
        refreshDownloading(hashResult);
      }
      setRecords(result);
    });
  };
  useEffect(() => {
    refreshDownloadRecord();
  }, [props]);
  return (<React.Fragment>
    <Helmet title="下载记录" />

    <Typography variant="h3" gutterBottom display="inline">
      近期下载
    </Typography>
    <Snackbar
      open={!!message}
      autoHideDuration={3000}
      onClose={() => {
        setMessage(null);
      }}
      message={message}
    ></Snackbar>
    <Divider my={4} />

    <Grid container spacing={6}>
      {records.map((row) => (<Grid item xs={12} lg={6} xl={4} key={row.id}>
        <Record
          id={row.id}
          key={row.id}
          title={row.name}
          year={row.year}
          tname={row.tname}
          site_name={row.site_name}
          description={row.desc}
          chip={<Chip label={row.status} color={row.status_color} />}
          image={row.thumb_image_url}
          status_code={row.status_code}
          showAnalyze={setAnalyze}
          downloading={downloading}
          handleDeleteRecordClickOpen={handleDeleteRecordClickOpen}
          media_source={row.media_source}
          resolution={row.resolution}
          media_encoding={row.media_encoding}
          url={row.url}
        />
      </Grid>))}
    </Grid>
    <ReAnalyze
      data={analyze}
      setAnalyze={setAnalyze}
      setMessage={setMessage}
    />
    <DeleteRecord deleteRecord={deleteRecordId} handleOk={handleDeleteRecordOk}
                  handleClose={handleDeleteRecordClose} />
  </React.Fragment>);
}

export default DownloadRecords;
