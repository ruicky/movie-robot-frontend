import {Divider as MuiDivider, Grid, Typography} from "@mui/material";
import Stats from "./Stats";
import {green, red} from "@mui/material/colors";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {spacing} from "@mui/system";
import {coverSize} from "../../utils/PtUtils";

const Divider = styled(MuiDivider)(spacing);

function Overview({data}) {
    return (<React.Fragment>
        <Grid justifyContent="space-between" container spacing={6}>
            <Grid item>
                <Typography variant="h3" gutterBottom>
                    站点数据
                </Typography>
                <Typography variant="subtitle1">
                    共有{data.site_count}个站点{data.site_vip_count > 0 ? '，其中有' + data.site_vip_count + '个是尊贵的VIP身份！👍' : ''}
                </Typography>
            </Grid>
        </Grid>

        <Divider my={6}/>

        <Grid container spacing={6}>
            <Grid item xs={12} sm={12} md={6} lg={3} xl>
                <Stats
                    title="今日上传"
                    amount={coverSize(data.today_up)}
                    chip={data.data_update_time}
                    percentagetext={data.today_up_rate}
                    desc='比昨日变化'
                    percentagecolor={data.today_up_rate.startsWith('+') ? green[500] : red[500]}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl>
                <Stats
                    title="今日下载"
                    amount={coverSize(data.today_dl)}
                    chip={data.data_update_time}
                    percentagetext={data.today_dl_rate}
                    desc='比昨日变化'
                    percentagecolor={data.today_dl_rate.startsWith('+') ? green[500] : red[500]}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl>
                <Stats
                    title="总上传量"
                    amount={coverSize(data.total_up)}
                    chip={data.data_update_time}
                    percentagetext={coverSize(data.up_change_7)}
                    desc='近7日新增'
                    percentagecolor={green[500]}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3} xl>
                <Stats
                    title="总下载量"
                    amount={coverSize(data.total_dl)}
                    chip={data.data_update_time}
                    percentagetext={coverSize(data.dl_change_7)}
                    desc='近7日下载'
                    percentagecolor={green[500]}
                />
            </Grid>
        </Grid>
    </React.Fragment>)
}

export default Overview;
