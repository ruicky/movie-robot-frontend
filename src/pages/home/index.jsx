import React, {useEffect, useState} from 'react';
import DailyRecommend from './DailyRecommend';
import DataFlowList from './DataFlowList/index';
import {useGetDailyMedia} from "@/api/CommonApi";
import message from "@/utils/message";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";

const HomePage = () => {
    const [media, setMedia] = useState({});
    const {mutateAsync: getDailyMedia, isLoading} = useGetDailyMedia();
    const refreshRandomMedia = () => {
        getDailyMedia({}, {
            onSuccess: resData => {
                const {code, message: msg, data} = resData;
                if (code === 0) {
                    setMedia(data);
                    localStorage.setItem('dailyMedia', JSON.stringify({
                        data: data,
                        date: new Date().format('yyyy-MM-dd')
                    }))
                }
            },
            onError: error => message.error(error)
        });
    }
    useEffect(() => {
        const data = JSON.parse(window.localStorage.getItem("dailyMedia"));
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
    }, [])
    return (
        <div>
            <FilterOptionsProvider>
                <DailyRecommend background={media?.backdrop_url} title={media.name} desc={media.comment}/>
                <DataFlowList/>
            </FilterOptionsProvider>
        </div>
    )
}

export default HomePage;