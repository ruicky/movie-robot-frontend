import React, { useEffect, useState, useRef, useCallback } from 'react';
import ListItem from './ListItem';
import { Button, Divider, Grid, Stack, Typography, Skeleton, Box } from "@mui/material";
import { useGetDoubanSuggestion } from "@/api/MovieApi";
import message from "@/utils/message";
import SubscribeDialog from "@/pages/subscribe/components/SubscribeDialog";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const DataFlowList = () => {
    const [subInfo, setSubInfo] = useState(null);
    const { mutateAsync: getMedia, isLoading } = useGetDoubanSuggestion();
    const [hasMore, setHasMore] = useState(true);
    const [mediaList, setMediaList] = useState([]);
    const currentStart = useRef(0);

    const fetchMediaList = useCallback((start = 0) => {
        getMedia({ start }, {
            onSuccess: resData => {
                const { code, message: msg, data } = resData;
                if (code === 0) {
                    if (data?.items && data.items.length > 0) {
                        setMediaList(mediaList => [...mediaList, ...data.items]);
                    }
                    if (data?.next_start) {
                        currentStart.current = data?.next_start;
                    }
                    setHasMore(data?.has_more);
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }, [getMedia])

    const fetchMore = useCallback(() => {
        fetchMediaList(currentStart.current);
    }, [fetchMediaList]);

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
    }, [fetchMediaList]);

    const ref = useRef(null)
    const entry = useIntersectionObserver(ref, { rootMargin: '0px 0px -20px 0px' })

    useEffect(() => {
        if (entry?.isIntersecting && currentStart.current > 0 && hasMore && !isLoading) {
            fetchMore();
        }
    }, [entry?.isIntersecting, fetchMore, hasMore, isLoading])

    return (
        <Grid>
            <Grid item>
                <Typography variant="h5" mt={2} gutterBottom>
                    推荐
                </Typography>
            </Grid>
            <Divider sx={{ my: 3 }} />
            {subInfo && <SubscribeDialog
                open={subInfo}
                onComplete={onSubComplete}
                handleClose={() => setSubInfo(null)}
                data={({ id: subInfo?.id, name: subInfo?.name, year: subInfo?.year })}
            />}
            <Stack spacing={2}>
                {
                    (mediaList || []).map(item => <ListItem key={item.id} data={item} onSub={onSub} />)
                }
                {hasMore && <div style={{
                    position: 'relative',
                    top: '-400px'
                }} ref={ref} />}
                {hasMore && Array.from(new Array(10)).map((item, index) => (
                    <ListItem key={index} />
                ))}
            </Stack>
            {
                !hasMore && <Button fullWidth disabled>没有更多了</Button>
            }
        </Grid >
    );
}

export default DataFlowList;