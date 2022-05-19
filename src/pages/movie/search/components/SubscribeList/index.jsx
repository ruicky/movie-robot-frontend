import React from 'react';
import MediaSlider from '@/pages/subscribe/components/MediaSlider';
import {useSubscribeSearchQuery} from "@/utils/subscribe";

const SubscribeList = ({keyword}) => {
    const {data, isLoading} = useSubscribeSearchQuery({keyword});
    if (data && data.data) {
        return (
            <MediaSlider
                sliderKey="requests"
                title={""}
                isLoading={isLoading}
                titles={data.data ?? []}
            />

        );
    } else {
        return null;
    }
}

export default SubscribeList;