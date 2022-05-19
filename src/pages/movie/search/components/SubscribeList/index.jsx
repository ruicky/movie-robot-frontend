import React from 'react';
import MediaSlider from '@/pages/subscribe/components/MediaSlider';
import {useSubscribeSearchQuery} from "@/utils/subscribe";

const SubscribeList = ({keyword}) => {
  const {data: list, isLoading} = useSubscribeSearchQuery({keyword});
    return (
        <MediaSlider
            sliderKey="requests"
            title={""}
            isLoading={isLoading}
            titles={list?.data ?? []}
        />

    );
}

export default SubscribeList;