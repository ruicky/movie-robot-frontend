import React from "react";
import {Button, Dialog, DialogActions, DialogContent, DialogTitle} from "@mui/material";
import ReactECharts from "echarts-for-react";
import {PieChart} from "@mui/icons-material";
import {SmallButton} from "@/components/core/SmallButton";
import {Skeleton} from "@mui/lab";
import {getRecordDashboard} from "@/api/DownloadApi";
import * as echarts from "echarts";

function MovieTypeChart({data}) {
    const movieCountOption = {
        title: {
            text: '媒体类型',
            left: 'left'
        },
        tooltip: {
            trigger: 'item'
        },

        color: ['#F53F31', '#FF9800'],
        series: [
            {
                name: '媒体类型',
                type: 'pie',
                radius: '80%',
                data: data,
                label: {
                    position: 'inner',
                    formatter: '{b} {c} 部'
                }
            }
        ]
    };
    return (
        <ReactECharts
            option={movieCountOption}
        />
    );
}

function SiteChart({data}) {
    const siteOption = {
        title: {
            text: '来源站点'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
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
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: data.map((item) => {
                return item['name']
            })
        },
        series: [
            {
                type: 'bar',
                data: data.map((item) => {
                    return item['value']
                }),
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}部'
                },
                itemStyle: {
                    normal: {
                        color: new echarts.graphic.LinearGradient(
                            0, 0, 1, 0,   // 0,0,1,0表示从左向右    0,0,0,1表示从右向左
                            [
                                {offset: 1, color: '#FFCE34'},
                                {offset: 0, color: '#FD665F'}
                            ]
                        )
                    }
                }
            }
        ]
    };
    return (
        <ReactECharts
            option={siteOption}
        />
    )
}

function ChartDialogs() {
    const [open, setOpen] = React.useState(false);
    const [movieCountData, setMovieCountData] = React.useState()
    const [siteCountData, setSiteCountData] = React.useState()
    const onOpen = () => {
        getRecordDashboard().then(r => {
            const data = r.data;
            setMovieCountData(data?.type_count);
            setSiteCountData(data?.site_count)
        });
        setOpen(true);
    }
    return (
        <>
            <SmallButton size="small" mr={2} onClick={onOpen}>
                <PieChart/>
            </SmallButton>
            <Dialog
                open={open}
                fullWidth={true}
                maxWidth={'md'}
                onClose={() => setOpen(false)}
                aria-labelledby="form-dialog-title"
            >
                <DialogTitle id="form-dialog-title">下载数据分析</DialogTitle>
                <DialogContent>
                    {movieCountData ? (<MovieTypeChart data={movieCountData}/>) : (
                        <Skeleton variant="rectangular"/>
                    )}
                    {siteCountData ? (<SiteChart data={siteCountData}/>) : (
                        <Skeleton variant="rectangular"/>
                    )}

                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}
                            color="primary">
                        取消
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default ChartDialogs