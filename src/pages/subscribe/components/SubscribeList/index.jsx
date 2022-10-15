import React, {useContext, useState} from "react";
import {useSubscribes} from "@/utils/subscribe";
import {Divider} from "@mui/material";
import TagFilter from "@/pages/subscribe/components/TagFilter";
import ListView from "@/pages/subscribe/components/ListView";
import {FilterOptionsContext} from "@/contexts/FilterOptionsProvider";
import SubLogDialog from "@/pages/subscribe/SubLogDialog";

const SubscribeList = ({mediaType}) => {
    const [subLogData, setSubLogData] = useState(null);
    const filterOptions = useContext(FilterOptionsContext)
    const FilterOptions = [
        {
            title: '订阅状态', key: 'status', data: [
                {
                    name: '订阅中',
                    value: 0
                }, {
                    name: '已完成',
                    value: 1
                }, {
                    name: '洗版中',
                    value: 2
                }
            ]
        }, {
            title: '区域', key: 'area', data: filterOptions?.area?.map((item) => {
                return {
                    name: item,
                    value: item
                }
            })
        }, {
            title: '风格', key: 'genres', data: filterOptions?.cate?.map((item) => {
                return {
                    name: item,
                    value: item
                }
            })
        }
    ]
    const [filter, setFilter] = useState({
        status: [0],
        genres: null,
        area: null
    });
    const {data: sublist, isLoading: subIsLoading} = useSubscribes({media_type: mediaType})

    return (<>
        <TagFilter options={FilterOptions} filter={filter} onFilter={setFilter}/>
        <Divider my={4}/>
        <SubLogDialog subId={subLogData?.subId}
                      title={subLogData?.title ? `${subLogData?.title}的订阅全息日志` : "未知信息"}
                      open={Boolean(subLogData)}
                      handleClose={() => setSubLogData(null)}/>
        <ListView
            items={sublist?.data?.filter((item) => {
                const {
                    status, genres, area
                } = item;
                let matchStatus = true;
                if (filter.status && filter.status.length > 0) {
                    matchStatus = filter.status.includes(status)
                }
                let matchGenres = true;
                if (genres && filter.genres && filter.genres.length > 0) {
                    const cate = genres.split(',')
                    matchGenres = filter.genres.filter(v => cate.includes(v)).length > 0
                }
                let matchArea = true;
                if (area && filter.area && filter.area.length > 0) {
                    const areas = area.split(',')
                    matchArea = filter.area.filter(v => areas.includes(v)).length > 0
                }
                return matchStatus && matchGenres && matchArea;
            })}
            isLoading={subIsLoading}
            showSubLogs={setSubLogData}
        />
    </>);
}
export default SubscribeList;