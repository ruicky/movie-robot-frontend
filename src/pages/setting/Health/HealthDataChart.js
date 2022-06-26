import ReactECharts from "echarts-for-react";
import React, {useEffect, useState} from "react";
import {useGetHealthIndicator} from "@/api/HealthApi";

function HealthDataChart({healthData}) {
    const [hours, setHours] = useState([]);
    const [serviceNames, setServiceNames] = useState([]);
    const [data, setData] = useState([])
    const [idxData, setIdxData] = useState(new Map())
    const option = {
        tooltip: {
            position: 'top',
            formatter: function (params) {
                const key = params.value[0] + '' + params.value[1];
                const val = idxData.get(key);
                return `${val.hour}时<br/>${val.status.DOWN}/${val.status.UP}（失败/成功）`;
            }
        },
        grid: {
            left: 2,
            bottom: 10,
            right: 10,
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: hours,
            boundaryGap: true,
            splitLine: {
                show: true
            },
            axisLine: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            data: serviceNames,
            axisLine: {
                show: true
            }
        },
        series: [
            {
                name: 'Punch Card',
                type: 'scatter',
                symbolSize: 30,
                data: data,
                animationDelay: function (idx) {
                    return idx * 5;
                },
                itemStyle: {
                    opacity: 1,
                    color: function (params) {
                        if (params.value[2] === 100) {
                            return '#228B22'
                        } else {
                            return '#E3170D'
                        }
                    }
                }
            }
        ]
    };
    useEffect(() => {
        if (healthData?.data) {
            const hourSet = new Set()
            const serviceNames = new Array();
            const items = new Array();
            const idx = new Map();
            for (let i = 0; i < healthData.data.length; i++) {
                const item = healthData.data[i];
                if (!item?.hours) {
                    continue;
                }
                serviceNames.push(item.service_name);
                for (let j = 0; j < item.hours.length; j++) {
                    const h = item.hours[j];
                    items.push([j, i, h.rate]);
                    idx.set(j + '' + i, h);
                    hourSet.add(h.hour+'时');
                }
            }
            setIdxData(idx);
            setServiceNames(serviceNames);
            setHours(Array.from(hourSet));
            setData(items);
            console.log(items)
        }
    }, [healthData])
    return (
        <ReactECharts
            option={option}
            style={{height: '100%'}}
        />
    )
}

export default HealthDataChart;