import {
    Card as MuiCard,
    CardActionArea,
    CardActions,
    CardContent,
    CardMedia,
    Chip as MuiChip,
    Divider,
    Grid,
    IconButton,
    Stack,
    Typography as MuiTypography,
} from "@mui/material";
import React from "react";
import styled from "styled-components/macro";
import DownloadBar from "./DownloadBar";
import {spacing} from "@mui/system";
import LinesEllipsis from 'react-lines-ellipsis'
import {ChevronRight as ChevronRightIcon, DeleteForever, Refresh as RefreshIcon} from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function MovieCard(props) {
    const {onDelete, onAnalyze, downloading} = props
    const {
        id,
        image,
        title,
        movie_type,
        tname,
        site_name,
        year,
        desc,
        status,
        status_color,
        status_code,
        resolution,
        media_source,
        media_encoding,
        url
    } = props.data;
    const handleAnalyze = () => {
        onAnalyze({open: true, year: year, id: id, name: title})
    };
    const handleDelete = () => {
        onDelete({open: true, id})
    }

    const CardWrapper = useMediaQuery((theme) => theme.breakpoints.up('md'))?CardContainer:Card;
    return (
        <Grid item md={6} lg={4} xl={3} key={id} style={{width: '100%'}}>
            <CardWrapper>
                {/*图片*/}
                <CardActionArea target="_blank" href={url || '#'}>
                    <CardMedia style={{height: '220px', display: 'flex'}} image={image || '/static/img/default.jpeg'}
                               title={title}
                               act>
                        {
                            title && <TitleConainer variant="subtitle1" component="h3" noWrap>
                                <span>{movie_type === "Movie" ? "电影" : "剧集"}&nbsp;{title ? `${title}(${year})` : ''} &nbsp;</span>
                                <IconButton sx={{color: '#fff'}}><ChevronRightIcon/> </IconButton>
                            </TitleConainer>
                        }
                    </CardMedia>
                </CardActionArea>
                <CardContent>
                    {/*文件名*/}
                    <Typography mb={2} color="h5" component="h2" noWrap>
                        {site_name != 'unknown' && `[${site_name}]`}
                        {tname}
                    </Typography>
                    {/*进度条*/}
                    {status_code == 0 && <DownloadBar downloading={downloading} id={id}/>}
                    {/*标签*/}
                    <Stack direction="row" spacing={1}>
                        <Chip label={status} color={status_color}/>
                        {media_source && <Chip label={media_source} color="primary"/>}
                        {resolution && <Chip label={resolution} color="success"/>}
                        {media_encoding && <Chip label={media_encoding} color="info"/>}
                    </Stack>
                    {/*影片描述*/}
                    <Typography mb={1} color="textSecondary" component="p">
                        <LinesEllipsis text={desc} maxLine={2} style={{minHeight: '40px'}}/>
                    </Typography>
                </CardContent>
                <Divider my={1}/>
                <CardActions container={true} sx={{justifyContent: 'flex-end'}}>
                    {
                        status_code !== 2 &&
                        <IconButton onClick={handleAnalyze} aria-label="重新识别" size="small">
                            <RefreshIcon/>
                        </IconButton>
                    }
                    <IconButton onClick={handleDelete} aria-label="删除" size="small">
                        <DeleteForever/>
                    </IconButton>
                </CardActions>
            </CardWrapper>
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
const TitleConainer = styled(Typography)`
    background: #313132a1;
    color: #fff;
    margin-top: auto;
    width: 100%;
    padding-left: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const CardContainer = styled(Card)`
  transition: all 0.2s ease-in-out;
  &:hover {
    position: relative;
    transform: translateY(-6px);
    box-shadow: 0px 3px 15px rgba(0,0,0,0.5);
  }
`;