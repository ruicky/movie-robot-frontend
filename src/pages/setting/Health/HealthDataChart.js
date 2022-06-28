import ReactECharts from "echarts-for-react";
import React, {useEffect, useState} from "react";
import {coverSize} from "@/utils/PtUtils";
import {useTheme} from "@mui/material/styles";

function HealthDataChart1({healthData}) {
    const [option, setOption] = useState(null);
    useEffect(() => {
        if (healthData?.data) {
            const title = [];
            const singleAxis = [];
            const series = [];
            for (let i = 0; i < healthData.data.length; i++) {
                const item = healthData.data[i];
                if (!item?.hours) {
                    continue;
                }
                const seriesDataItems = new Array();
                const hourAxis = new Array();
                item.hours.sort(function(a,b){
                    return (a.time - b.time);
                })
                for (let j = 0; j < item.hours.length; j++) {
                    const h = item.hours[j];
                    seriesDataItems.push([j, h.rate,h.status]);
                    hourAxis.push(h.hour + '时');
                    // idx.set(j + '' + i, h);
                }
                title.push({
                    textBaseline: 'middle',
                    top: ((i + 0.5) * 100) / 7 + '%',
                    text: item.service_name,
                    textStyle:{
                        fontSize:13,
                        width:2
                    },
                    left: '1%'
                });
                singleAxis.push({
                    left: 150,
                    type: 'category',
                    boundaryGap: false,
                    data: hourAxis,
                    top: (i * 100) / 7 + 5 + '%',
                    height: 100 / 7 - 10 + '%',
                    axisLabel: {
                        interval: 0,
                        rotate: 60
                    }
                });
                series.push({
                    singleAxisIndex: i,
                    coordinateSystem: 'singleAxis',
                    type: 'scatter',
                    data: seriesDataItems,
                    symbolSize: function (dataItem) {
                        return 25;
                    },
                    itemStyle:{
                        shadowBlur: 10,
                        shadowColor: 'rgba(120, 36, 50, 0.5)',
                        shadowOffsetY: 5,
                        color: function (params) {
                            if (params.value[1] === 100) {
                                return '#32CD32'
                            } else {
                                return '#E3170D'
                            }
                        }
                    }
                });
            }
            setOption({
                tooltip: {
                    position: 'top',
                    formatter: function (params) {
                        return `${params.name}<br/>${params.marker}${params.value[2].DOWN}/${params.value[2].UP}（失败/成功）`;
                    }
                },
                title: title,
                singleAxis: singleAxis,
                series: series
            });
        }
    }, [healthData])
    return (
        <>
            {option && <ReactECharts
                option={option}
                style={{height: '100%'}}
            />}
        </>
    )
}

export default HealthDataChart1;