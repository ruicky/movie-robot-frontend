import React from 'react';
import MediaSlider from '../../../subscribe/components/MediaSlider';
import {useDoubanRanking} from "@/api/MovieApi";

const DoubanRanking = ({title, rankType}) => {
    const {data: subjects, isLoading: subjectsIsLoading} = useDoubanRanking({type: rankType});
    return (
        <MediaSlider
            sliderKey="requests"
            title={title}
            isLoading={subjectsIsLoading}
            titles={subjects?.data ?? []}
        />

    );
};

export default DoubanRanking;