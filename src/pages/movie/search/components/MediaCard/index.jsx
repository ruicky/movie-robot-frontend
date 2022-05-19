import React, {useEffect, useState} from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    CardMedia,
    Dialog,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
    ListItem,
    ListItemText,
    Stack,
    Typography
} from "@mui/material";
import MetaTag from "@/pages/movie/search/components/MetaTag";
import {Autorenew} from "@mui/icons-material";
import {SmallButton} from "@/components/core/SmallButton";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DropDownBox from "@/components/DropDownBox";

const MediaMeta = ({video_resolution, video_codec, video_container}) => {
    return (
        <Stack direction="row" spacing={1} mt={2}>
            <MetaTag label={video_resolution} color="success"/>
            <MetaTag label={video_codec} color="info"/>
            <MetaTag label={video_container} color="primary"/>
        </Stack>
    )
}
const StreamInfoDialog = ({title, streams}) => {
    const [open, setOpen] = useState(false);
    return (
        <>
            <SmallButton size="medium" mr={2} onClick={() => setOpen(true)}>
                {streams[0]}<ExpandMoreIcon/>
            </SmallButton>
            <Dialog
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <List>
                            {streams.map((item) => (
                                <ListItem key={item}>
                                    <ListItemText
                                        primary={item}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </DialogContentText>
                </DialogContent>
            </Dialog>
        </>
    )
}
const Stream = ({title, streams}) => {
    if (!streams || streams.length == 0) {
        streams = ['无']
    }
    const streamSet = new Set(streams.map((s) => {
        return s.display_title;
    }));
    const streamList = Array.from(streamSet)
    return (
        <>
            <Typography variant="subtitle1" color="text.secondary" component="div">
                {title}: {streamList.length === 1 ? streamList[0] :
                <StreamInfoDialog title={"全部" + title} streams={streamList}/>}
            </Typography>
        </>
    )
}
const MovieCard = ({media}) => {
    return (
        <Card sx={{
            display: 'flex',
            flexGrow: 1,
            opacity: 0.4,
            backgroundSize: "cover",
            backgroundPosition: "center center",
            backgroundImage: `url(${media.backdrop_url})`
        }}>
            <CardMedia
                component="img"
                sx={{width: 151, borderRadius: '6px'}}
                image={media.poster_url}
            />
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        {media.name}
                    </Typography>
                    <MediaMeta video_codec={media.video_codec} video_resolution={media.video_resolution}
                               video_container={media.video_container}/>
                    <Stream title="音频" streams={media.audio_streams}/>
                    <Stream title="字幕" streams={media.subtitle_streams}/>
                </CardContent>
                <CardContent>
                    <Button variant="outlined" startIcon={<Autorenew/>}>
                        洗版
                    </Button>
                </CardContent>
            </Box>
        </Card>
    )
}
const TVCard = ({media}) => {
    const [seasonName, setSeasonName] = useState()
    const [seasons, setSeasons] = useState([])
    const [audioStreams, setAudioStreams] = useState([])
    const [subtitleStreams, setSubtitleStreams] = useState([])
    const onSeasonChange = (value) => {
        const season = findSeason(value);
        if (!season) {
            return;
        }
        setSeasonName(`第${season.index}季`);
        setAudioStreams(season.audio_streams)
        setSubtitleStreams(season.subtitle_streams)
    }
    const findSeason = (index) => {
        const ss = media.sub_items.filter((item) => {
            return item.index === index
        });
        if (ss.length > 0) {
            return ss[0];
        } else {
            return null;
        }
    }
    useEffect(() => {
        setSeasons(media.sub_items.map((item) => {
            return {
                name: `第${item.index}季`,
                value: item.index
            }
        }))
        const lastSeason = media.sub_items[media.sub_items.length - 1];
        setSeasonName(`第${lastSeason.index}季`);
        setAudioStreams(lastSeason.audio_streams)
        setSubtitleStreams(lastSeason.subtitle_streams)
    }, [media])
    return (
        <Card sx={{
            display: 'flex',
            opacity: 0.4,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundImage: `url(${media.backdrop_url})`
        }}>
            <CardMedia
                component="img"
                sx={{width: 151, borderRadius: '6px'}}
                image={media.poster_url}
            />
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div" variant="h5">
                        {media.name}
                        <DropDownBox
                            value={seasonName}
                            data={seasons}
                            onChange={onSeasonChange}
                        />
                    </Typography>
                    <MediaMeta video_codec={media.video_codec} video_resolution={media.video_resolution}
                               video_container={media.video_container}/>
                    <Stream title="音频" streams={audioStreams}/>
                    <Stream title="字幕" streams={subtitleStreams}/>
                </CardContent>
                <CardContent>
                    <Button variant="outlined" startIcon={<Autorenew/>}>
                        洗版
                    </Button>
                </CardContent>
            </Box>

        </Card>
    )
}
const MediaCard = ({media}) => {
    if (media.type === 'Movie') {
        return (
            <MovieCard media={media}/>
        )
    } else {
        return (
            <TVCard media={media}/>
        )
    }
}

export default MediaCard;