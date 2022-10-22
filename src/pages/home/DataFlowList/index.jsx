import React, { useEffect, useState, useRef, useCallback } from 'react';
import ListItem from './ListItem';
import { Button, Divider, Grid, Stack, Typography, Skeleton, Box } from "@mui/material";
import { useGetDoubanSuggestion } from "@/api/MovieApi";
import SubscribeDialog from "@/pages/subscribe/components/SubscribeDialog";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";

const DataFlowList = () => {
    const [subInfo, setSubInfo] = useState(null);
    const { data: mediaList,
        fetchNextPage,
        hasNextPage,
        isFetching,
    } = useGetDoubanSuggestion();

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

    const ref = useRef(null)
    const entry = useIntersectionObserver(ref)

    useEffect(() => {
        console.log('entry', entry?.isIntersecting, hasNextPage, isFetching)
        if (entry?.isIntersecting && hasNextPage && !isFetching) {
            console.log('fetchNextPage')
            fetchNextPage();
        }
    }, [entry?.isIntersecting, hasNextPage, isFetching])


    useEffect(() => {
        console.warn('mediaList', mediaList)
    }, [mediaList])

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
                    mediaList && (mediaList.pages || []).map(pages => pages.items.map(item => <ListItem key={item.id} data={item} onSub={onSub} />))
                }

                {hasNextPage && isFetching && Array.from(new Array(10)).map((item, index) => (
                    <ListItem key={index} />
                ))}

                {<div style={{
                    position: 'relative',
                    top: '-400px',
                    height: '4px',
                }} ref={ref} />}
            </Stack>
            {
                !hasNextPage && <Button fullWidth disabled>没有更多了</Button>
            }
        </Grid >
    );
}

export default DataFlowList;