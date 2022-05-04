import {FormControl, FormHelperText, Link, MenuItem, Select} from "@mui/material";
import React, {useEffect, useState} from "react";
import axios from "../../utils/request";

const ScoreRuleSelectComponent = ({data, name, value, onChange}) => {
    return (
        <FormControl m={4} fullWidth>
            <Select
                name={name}
                value={value}
                onChange={onChange}
                displayEmpty
            >
                {data.map((value, i) => (
                    <MenuItem key={value} value={value}>{value}</MenuItem>
                ))}
            </Select>
            <FormHelperText>
                <span>
                    默认智能下载的选种策略
                    <Link target="_blank"
                          href="https://yee329.notion.site/12f6d44243194c8c96a7e000b9dde023">
                            详细介绍
                        </Link>
                </span></FormHelperText>
        </FormControl>
    )
}
export default ScoreRuleSelectComponent;