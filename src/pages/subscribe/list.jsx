import React, {useEffect, useState} from 'react';

import PageTitle from '@/components/PageTitle';
import {Helmet} from "react-helmet-async";
import ListView from "@/pages/subscribe/components/ListView";
import {useSubscribes} from "@/utils/subscribe";
import {getFilterConfigList} from "@/api/ConfigApi";


const SubList = () => {
    const {data: sublist, isLoading: subIsLoading} = useSubscribes()

    return (
        <>
            <Helmet title="我的订阅"/>
            <PageTitle text="我的订阅"/>
            <ListView
                items={sublist?.data}
                isLoading={subIsLoading}

            />
        </>
    );

};

export default SubList;
