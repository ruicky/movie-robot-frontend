import {
  CardActionArea,
  CardMedia,
  Chip as MuiChip,
  Stack,
  Typography as MuiTypography,
  CardContent,
  Button,
  Tooltip,
  Divider,
  Card as MuiCard,
  CardActions,
  Grid,
} from "@mui/material";
import React from "react";
import styled from "styled-components/macro";
import DownloadBar from "./DownloadBar";
import {spacing} from "@mui/system";
import LinesEllipsis from 'react-lines-ellipsis'
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import DeleteIcon from '@mui/icons-material/Delete';

export default function MovieCard (props) {
  const {onDelete,onAnalyze, downloading} = props
  const {
    id,
    image,
    title,
    tname,
    site_name,
    year,
    desc,
    chip,
    status_code,
    resolution,
    media_source,
    media_encoding,
    url
  } = props.data;

  const handleAnalyze = () => {
    onAnalyze({ open: true, year: year, id: id, name:title })
  };
  const handleDelete = () => {
    onDelete({open: true, id})
  }

  return(
    <Grid item md={6} lg={4} xl={2}  key={id} style={{width: '100%'}}>
      <Card>
        {/*图片*/}
        <CardActionArea target="_blank" href={url || '#'}>
          <CardMedia style={{height: '220px'}} image={image || '/img/default.jpeg'} title={title} />
        </CardActionArea>
        <CardContent>
          {/*标题*/}
          <Typography gutterBottom variant="h5" component="h2" noWrap>
            {title ? `${title}(${year})` : ''} &nbsp;
          </Typography>
          {/*文件名*/}
          <Typography mb={2} color="h5" component="h2" noWrap>
            {site_name !='unknown' && `[${site_name}]`}
            {tname}
          </Typography>
          {/*进度条*/}
          {status_code == 0 && <DownloadBar downloading={downloading} id={id}/>}
          {/*标签*/}
          <Stack direction="row" spacing={1}>
            {status_code !== 0 ? chip : null}
            {media_source && <Chip label={media_source} color="primary" />}
            {resolution && <Chip label={resolution} color="success" />}
            {media_encoding && <Chip label={media_encoding} color="info" />}
          </Stack>
          {/*影片描述*/}
          <Typography mb={1} color="textSecondary" component="p">
            <LinesEllipsis text={desc} maxLine={2} style={{minHeight: '40px'}} />
          </Typography>
        </CardContent>
        <Divider my={1} />
        <CardActions container={true} sx={{justifyContent: 'flex-end'}}>
          {
            status_code !== 2 &&
            <Button size="small" color="primary" onClick={handleAnalyze}>
            重新识别
            </Button>
          }
          <Button size="small" color="primary" onClick={handleDelete}>
            删除
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
};
const Card = styled(MuiCard)(spacing);
const Typography = styled(MuiTypography)(spacing);
const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;
