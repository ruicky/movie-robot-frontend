import React, {useState} from 'react';
import {useSubscribeSearchQuery} from "@/utils/subscribe";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";
import ListView from "@/pages/subscribe/components/ListView";
import {Typography} from "@mui/material";
import MediaSlider from "@/pages/subscribe/components/MediaSlider";

const SubscribeList = ({keyword, posterWall = false}) => {
    const [subLogData, setSubLogData] = useState(null);
    const {data, isLoading} = useSubscribeSearchQuery({keyword});
    if (data && data.data) {
        return (
            <>
                <SubLogDialog subId={subLogData?.subId}
                              title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                              open={Boolean(subLogData)}
                              handleClose={() => setSubLogData(null)}/>
                <Typography variant="h5" component="div" mt={2} gutterBottom>
                    影片{data.data.length === 0 ? "(无结果)" : ""}
                </Typography>
                {posterWall ? <ListView
                    items={data.data.map((item)=>{
                        return {
                            douban_id:item.id,
                            cn_name:item.cn_name,
                            poster_path:item.poster_path,
                            rating:item.rating,
                            sub_id:item.sub_id,
                            status:item.status
                        }
                    }) ?? []}
                    isLoading={isLoading}
                    showSubLogs={setSubLogData}
                /> : <MediaSlider
                    sliderKey="requests"
                    title={""}
                    isLoading={isLoading}
                    titles={data.data ?? []}
                    showSubLogs={setSubLogData}
                />}

            </>

        );
    } else {
        return null;
    }
}

export default SubscribeList;