import React, {useContext, useEffect, useState} from 'react';
import {Box, IconButton, InputBase, Paper, Typography} from '@mui/material';
import styled from "styled-components/macro";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import {useUrlQueryParam} from "@/hooks/useUrlQueryParam";
import {AppInfoContext} from "@/contexts/AppSetting";

const TopSearch = ({onClose, site, category, searchContent}) => {
    const navigate = useNavigate();
    const appInfo = useContext(AppInfoContext);
    const [param, setParam] = useUrlQueryParam(["keyword"]);
    const [keyword, setKeyword] = useState(param.keyword);
    useEffect(() => {
        setKeyword(param.keyword)
    }, [param.keyword])
    return (
        <PaperWrap
            sx={{p: '2px 4px', display: 'flex', alignItems: 'center'}}
        >
            <SearchInputWrap sx={{flex: 1}}>
                <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                    <SearchIcon/>
                </IconButton>
                <InputBase
                    autoFocus
                    sx={{ml: 1, flex: 1}}
                    placeholder='搜索'
                    inputProps={{'aria-label': '搜索'}}
                    defaultValue={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyUp={(e) => {
                        if ((e.key === 'Enter' || e.key === "NumpadEnter") && keyword) {
                            let siteStr = '';
                            let cateStr = '';
                            if (site) {
                                siteStr = encodeURIComponent(site.join(','));
                            }
                            if (category) {
                                cateStr = encodeURIComponent(category.join(','));
                            }
                            navigate(`/movie/search?keyword=${keyword}&site_id=${siteStr}&cates=${cateStr}&searchDouban=${searchContent['searchDouban']}&searchMediaServer=${searchContent['searchMediaServer']}&searchSite=${searchContent['searchSite']}`)
                            onClose()
                        }
                    }}
                />
            </SearchInputWrap>
            <Typography variant="button" display="block" sx={{cursor: 'pointer', ml: 2}} color='info.main'
                        onClick={onClose}>
                取消
            </Typography>
        </PaperWrap>
    );
}

const PaperWrap = styled(Paper)``;

const SearchInputWrap = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  border-radius: 10px;
`;

export default TopSearch;