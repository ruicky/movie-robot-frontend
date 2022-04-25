import message from "@/utils/message";
import {Paper, Typography} from "@mui/material";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {Helmet} from "react-helmet-async";
import {getFilterOptions} from "@/api/CommonApi";
import {getFilterConfig, saveFilterConfig} from "@/api/ConfigApi";
import {useNavigate, useSearchParams} from "react-router-dom";
import FilterForm from "@/components/Selectors/FilterForm";


const Wrapper = styled(Paper)`
  padding: ${(props) => props.theme.spacing(6)};

  ${(props) => props.theme.breakpoints.up("md")} {
    padding: ${(props) => props.theme.spacing(10)};
  }
`;

function FilterEdit() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [formValues, setFormValues] = useState();
    const [filterOptions, setFilterOptions] = useState();
    const onSubmit = async (values, setErrors) => {
        values['edit_filter_name'] = searchParams.get("filterName");
        const r = await saveFilterConfig(values)
        if (r.code === 0) {
            message.success(r.message)
            navigate("/smartDownload/selectors")
        } else {
            setErrors({submit: r.message});
        }
    }
    useEffect(async () => {
        const filterOptions = await getFilterOptions()
        setFilterOptions(filterOptions)
        if (searchParams.get("filterName")) {
            const config = await getFilterConfig(searchParams.get("filterName"))
            if (config) {
                setFormValues(config)
            }
        }
    }, [searchParams])
    return (
        <Wrapper>
            <Helmet title="订阅过滤条件设置"/>

            <Typography component="h1" variant="h4" align="center" gutterBottom>
                自定义过滤器
            </Typography>
            <Typography component="h2" variant="body1" align="center">
                你可以自定义一些过滤资源的条件，并设定应用范围，智能下载时会根据应用范围自动选用此过滤器。
            </Typography>
            <FilterForm formValues={formValues} filterOptions={filterOptions} onSubmit={onSubmit}/>
        </Wrapper>
    )
}

export default FilterEdit;