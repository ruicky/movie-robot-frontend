import {useGetFilterOptions} from "@/api/CommonApi";
import React, {useState} from "react";
import {useSubscribes} from "@/utils/subscribe";
import {Divider} from "@mui/material";
import TagFilter from "@/pages/subscribe/components/TagFilter";
import ListView from "@/pages/subscribe/components/ListView";

const SubscribeList = ({mediaType}) => {
    const {data: filterOptions} = useGetFilterOptions();
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
            title: '区域', key: 'area', data: filterOptions?.data?.area?.map((item) => {
                return {
                    name: item,
                    value: item
                }
            })
        }, {
            title: '风格', key: 'genres', data: filterOptions?.data?.cate?.map((item) => {
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

        />
    </>);
}
export default SubscribeList;