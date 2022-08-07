import React from 'react';
import MediaSlider from '../../../subscribe/components/MediaSlider';
import {useDoubanRanking} from "@/api/MovieApi";
import {SmallButton} from "@/components/core/SmallButton";
import SubscriptionsIcon from '@mui/icons-material/Subscriptions';
import DeleteIcon from '@mui/icons-material/Delete';

const Option = ({isSub, onSub, onDelete}) => {
    return (
        <SmallButton size="small" mr={2} color="secondary" onClick={isSub ? onSub : onDelete}>
            {isSub ? <SubscriptionsIcon/> : <DeleteIcon/>}
        </SmallButton>
    )
}
const DoubanRanking = ({title, trendingType, trendingName, onSub, onDelete, isSub}) => {
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
            />
        </>
    );
};

export default DoubanRanking;