import React, {useEffect, useState} from 'react';
import DailyRecommend from './DailyRecommend';
import DataFlowList from './DataFlowList/index';
import {useGetDailyMedia} from "@/api/CommonApi";
import message from "@/utils/message";
import {FilterOptionsProvider} from "@/contexts/FilterOptionsProvider";
import SubscribeDialog from "@/pages/subscribe/components/SubscribeDialog";

const CACHE_KEY = "dailyRecommend";
const HomePage = () => {
    const [subInfo, setSubInfo] = useState(null);
    const [media, setMedia] = useState({});
    const {mutateAsync: getDailyMedia, isLoading} = useGetDailyMedia();
    const refreshRandomMedia = () => {
        getDailyMedia({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setMedia(data);
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data: data,
                        date: new Date().format('yyyy-MM-dd')
                    }))
                }
            },
            onError: error => message.error(error)
        });
    }
    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem(CACHE_KEY));
        let dailyMedia = null;
        if (data) {
            if (data.date === new Date().format('yyyy-MM-dd')) {
                dailyMedia = data.data;
            } else {
                localStorage.removeItem('backdropUrlJson');
            }
        }
        if (dailyMedia === null) {
            refreshRandomMedia();
        } else {
            setMedia(dailyMedia);
        }
    }, []);
    const onSub = () => {
        if (!media) {
            return;
        }
        setSubInfo({
            id: media.doubanId,
            name: media.title,
            year: media.releaseYear
        });
    }
    return (
        <div>
            <FilterOptionsProvider>
                <SubscribeDialog
                    open={subInfo}
                    handleClose={() => setSubInfo(null)}
                    data={({id: subInfo?.id, name: subInfo?.name, year: subInfo?.year})}
                />
                <DailyRecommend background={media?.backgroundUrl} title={media?.title} desc={media?.comment} rating={media?.rating}
                                onPicClick={onSub} url={media?.url} appUrl={media?.appUrl}/>
                <DataFlowList/>
            </FilterOptionsProvider>
        </div>
    )
}

export default HomePage;