import React from 'react';
import MediaSlider from '../../../subscribe/components/MediaSlider';
import {useDoubanRanking} from "@/api/MovieApi";
import {SmallButton} from "@/components/core/SmallButton";

const Option = ({isSub, onSub, onDelete}) => {
    return (
        <SmallButton size="small" mr={2} color={isSub ? "primary" : "error"} onClick={isSub ? onSub : onDelete}>
            {isSub ? "订阅榜单" : "取消订阅"}
        </SmallButton>
    )
}
const DoubanRanking = ({title, trendingType, trendingName, onSub, onDelete, isSub, showSubLogs}) => {
    const {data: subjects, isLoading: subjectsIsLoading} = useDoubanRanking({type: trendingType});
    return (
        <>
            <MediaSlider
                sliderKey="requests"
                title={title}
                isLoading={subjectsIsLoading}
                titles={subjects?.data ?? []}
                optionComponent={onSub && onDelete &&
                <Option isSub={isSub} onSub={(e) => onSub(trendingType, trendingName)}
                        onDelete={() => onDelete(trendingType, trendingName)}/>}
                showSubLogs={showSubLogs}
            />
        </>
    );
};

export default DoubanRanking;