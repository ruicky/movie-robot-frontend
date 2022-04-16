import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import React from "react";
import {coverSize} from "@/utils/PtUtils";
import {Paper} from "@mui/material";

function SiteSharesWeek({data}) {
    const siteOption = {
        title: {
            text: '近7天流量变化',
            padding: 15,
            textStyle: {
                fontSize: '1rem'
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: (params, ticket, callback) => {
                let tips = params[0].name + "<br/>";
                tips += params[0].marker + "上传：" + coverSize(params[0].value) + "<br/>"
                tips += params[1].marker + "下载：" + coverSize(params[1].value) + "<br/>"
                return tips
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01],
            axisLabel: {
                rotate: 60,
                formatter: (value) => {
                    return coverSize(value)
                }
            },
            splitLine: {
                lineStyle: {
                    type: 'dashed',
                    color: '#333'
                }
            }
        },
        yAxis: {
            type: 'category',
            data: data.map((item) => {
                return item['name']
            })
        },
        series: [
            {
                name: '上传',
                type: 'bar',
                data: data.map((item) => {
                    return item['upload']
                }),
                label: {
                    show: true,
                    position: 'right',
                    formatter: (params) => {
                        if (params.value === 0) {
                            return '';
                        }
                        return coverSize(params.value)
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 1, 0,   // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
                            [
                                {offset: 1, color: '#FF9800'},
                                {offset: 0, color: '#EF5555'}
                            ]
                        )
                    }
                }
            },
            {
                name: '下载',
                type: 'bar',
                data: data.map((item) => {
                    return item['download']
                }),
                label: {
                    show: true,
                    position: 'right',
                    formatter: (params) => {
                        if (params.value == 0) {
                            return '';
                        }
                        return coverSize(params.value)
                    }
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 1, 0,   // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
                            [
                                {offset: 1, color: '#66BB6A'},
                                {offset: 0, color: '#9BD29D'}
                            ]
                        )
                    }
                }
            }
        ]
    };
    return (
        <Paper>
            <ReactECharts
                option={siteOption}
                style={{height: 624}}
            />
        </Paper>
    )
}

export default SiteSharesWeek;