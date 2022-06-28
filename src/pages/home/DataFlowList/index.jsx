import React, {useEffect, useState} from 'react';
import ListItem from './ListItem';
import {Button, Divider, Grid, Stack, Typography} from "@mui/material";
import {useGetDoubanSuggestion} from "@/api/MovieApi";
import message from "@/utils/message";
import SubscribeDialog from "@/pages/subscribe/components/SubscribeDialog";


const DataFlowList = () => {
    const [subInfo, setSubInfo] = useState(null);
    const {mutateAsync: getMedia, isLoading} = useGetDoubanSuggestion();
    const [hasMore, setHasMore] = useState(true);
    const [mediaList, setMediaList] = useState([]);
    const [currentStart, setCurrentStart] = useState(0);
    const fetchMediaList = (start = 0) => {
        getMedia({start}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    if (data?.items && data.items.length > 0) {
                        let newList = [...mediaList];
                        newList = newList.concat(data.items);
                        setMediaList(newList);
                    }
                    setCurrentStart(data?.next_start);
                    setHasMore(data?.has_more);
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }
    const fetchMore = () => {
        fetchMediaList(currentStart);
    }
    const onSub = (media) => {
        setSubInfo({
            id: media.id,
            name: media.title,
            year: media.year
        });
    }
    const onSubComplete = () => {
        const newList = mediaList.map((item) => {
            if (item.id === subInfo.id) {
                const updatedItem = {
                    ...item,
                    isSub: true,
                };
                return updatedItem;
            }
            return item;
        });
        setMediaList(newList);
        setSubInfo(null);
    }
    useEffect(() => {
        fetchMediaList(0);
    }, []);
    return (
        <Grid spacing={6}>
            <Grid item>
                <Typography variant="h5" mt={2} gutterBottom>
                    推荐
                </Typography>
            </Grid>
            <Divider sx={{my: 3}}/>
            <SubscribeDialog
                open={subInfo}
                onComplete={onSubComplete}
                handleClose={() => setSubInfo(null)}
                data={({id: subInfo?.id, name: subInfo?.name, year: subInfo?.year})}
            />
            <Stack spacing={2}>
                {
                    (mediaList || []).map(item => <ListItem key={item.id} data={item} onSub={onSub}/>)
                }
            </Stack>
            {hasMore ?
                <Button variant="text" disabled={isLoading} onClick={() => fetchMore()} fullWidth>加载更多</Button> :
                <Button fullWidth disabled>没有更多了</Button>}
        </Grid>
    );
}

export default DataFlowList;