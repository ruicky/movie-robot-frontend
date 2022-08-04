import React, {useContext, useEffect, useState} from 'react';
import {Box, IconButton, InputBase, Paper, Typography} from '@mui/material';
import styled from "styled-components/macro";
import SearchIcon from '@mui/icons-material/Search';
import {useNavigate} from "react-router-dom";
import {useUrlQueryParam} from "@/hooks/useUrlQueryParam";

const TopSearch = ({onClose, site, category, searchContent}) => {
    const navigate = useNavigate();
    const [param, setParam] = useUrlQueryParam(["keyword"]);
    const [keyword, setKeyword] = useState(param.keyword);
    useEffect(() => {
        setKeyword(param.keyword)
    }, [param.keyword])
    const handleSearch = () => {
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
    return (
        <PaperWrap
            sx={{p: '2px 4px', display: 'flex', alignItems: 'center'}}
        >
            <SearchInputWrap>
                <IconButton type="button" sx={{p: '10px'}} aria-label="search">
                    <SearchIcon/>
                </IconButton>
                <InputBase
                    autoFocus
                    sx={{ml: 1, flex: 1, width: '100%'}}
                    placeholder='搜索'
                    inputProps={{'aria-label': '搜索'}}
                    defaultValue={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyUp={(e) => {
                        if ((e.key === 'Enter' || e.key === "NumpadEnter") && keyword) {
                            handleSearch()
                        }
                    }}
                />
                <Typography
                  variant="button"
                  display="inline-block"
                  sx={{cursor: 'pointer',mx:3}}
                  color='info.main'
                  onClick={handleSearch}>
                    搜索
                </Typography>
            </SearchInputWrap>

        </PaperWrap>
    );
}

const PaperWrap = styled(Paper)``;

const SearchInputWrap = styled(Box)`
  background-color: ${(props) => props.theme.palette.background.default};
  border-radius: 50px;
  flex: 1;
  display: grid;
  grid-template-columns: auto 1fr auto;
  place-items: center;
`;

export default TopSearch;