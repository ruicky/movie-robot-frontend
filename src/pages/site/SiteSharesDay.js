import ReactECharts from "echarts-for-react";
import React from "react";
import {Paper} from "@mui/material";
import {coverSize} from "@/utils/PtUtils";
import { useTheme } from "@mui/material/styles";


function SiteSharesDay({data, title, tooltip_title}) {
    const theme = useTheme();
    const option = {
        title: {
            text: title,
            left: 'left',
            padding: 15,
            textStyle: {
                fontSize: '1rem',
                color: theme.palette.text.primary
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: (params, ticket, callback) => {
                console.log(params)
                let tips = params.name + "<br/>";
                tips += params.marker + tooltip_title + "：" + coverSize(params.value) + "<br/>"
                return tips
            }
        },
        series: [
            {
                name: title,
                type: 'pie',
                radius: '80%',
                data: data,
                label: {
                    position: 'inner',
                    formatter: (params) => {
                        return params.name + " " + coverSize(params.value)
                    },
                }
            }
        ]
    };
    return (
        <Paper>
            <ReactECharts
                option={option}
            />
        </Paper>
    );
}

export default SiteSharesDay;