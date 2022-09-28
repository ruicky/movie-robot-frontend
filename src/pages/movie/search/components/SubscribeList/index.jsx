import React, {useState} from 'react';
import MediaSlider from '@/pages/subscribe/components/MediaSlider';
import {useSubscribeSearchQuery} from "@/utils/subscribe";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";

const SubscribeList = ({keyword}) => {
    const [subLogData, setSubLogData] = useState(null);
    const {data, isLoading} = useSubscribeSearchQuery({keyword});
    if (data && data.data) {
        return (
            <>
                <SubLogDialog subId={subLogData?.subId}
                              title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                              open={Boolean(subLogData)}
                              handleClose={() => setSubLogData(null)}/>

                <MediaSlider
                    sliderKey="requests"
                    title={""}
                    isLoading={isLoading}
                    titles={data.data ?? []}
                    showSubLogs={setSubLogData}
                />
            </>

        );
    } else {
        return null;
    }
}

export default SubscribeList;