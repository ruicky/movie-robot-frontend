import React, {useEffect, useState} from 'react';
import ListItem from './ListItem';
import {Button, Divider, Grid, Stack, Typography} from "@mui/material";
import {useGetDoubanSuggestion} from "@/api/MovieApi";
import message from "@/utils/message";


const DataFlowList = () => {
    const {mutateAsync: getMedia, isLoading} = useGetDoubanSuggestion();
    const [hasMore, setHasMore] = useState(true);
    const [mediaList, setMediaList] = useState([]);
    const [currentStart, setCurrentStart] = useState(0);
    const fetchMediaList = (start = 0) => {
        getMedia({start}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    if (data && data.length > 0) {
                        let newList = [...mediaList];
                        newList = newList.concat(data);
                        setMediaList(newList);
                    } else {
                        setHasMore(false);
                    }
                } else {
                    message.error(msg);
                }
            },
            onError: error => message.error(error)
        });
    }
    const fetchMore = () => {
        let start = currentStart + 10;
        fetchMediaList(start);
        setCurrentStart(start);
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
            <Stack spacing={2}>
                {
                    (mediaList || []).map(item => <ListItem data={item}/>)
                }
            </Stack>
            {hasMore ?
                <Button variant="text" disabled={isLoading} onClick={() => fetchMore()} fullWidth>加载更多</Button> :
                <Button fullWidth disabled>没有更多了</Button>}
        </Grid>
    );
}

export default DataFlowList;