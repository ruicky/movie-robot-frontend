import React, {useContext, useEffect, useState} from 'react';
import {Dialog, DialogContent, Slide, DialogTitle, IconButton} from '@mui/material';
import styled from "styled-components/macro";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopSearch from './TopSearch';
import SearchTag from './SearchTag';
import SearchHistory from './SearchHistory'
import {AppInfoContext} from "@/contexts/AppSetting";
import {useGetMySites} from "@/api/SiteApi";
import CloseIcon from '@mui/icons-material/Close';
import SearchMenu from "@/components/SearchDialog/SearchMenu";
import OpenExtend from "@/components/SearchDialog/OpenExtend";

const SearchDialog = ({open, onClose}) => {
    const appInfo = useContext(AppInfoContext)
    const theme = useTheme();
    const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const {data: siteData} = useGetMySites();
    const SearchContent = [
        {
            name: "豆瓣",
            value: "searchDouban",
            checked: true
        },
        {
            name: "媒体库",
            value: "searchMediaServer",
            checked: true
        },
        {
            name: "资源站",
            value: "searchSite",
            checked: appInfo?.server_config?.auth_search_result === undefined ? true : appInfo?.server_config?.auth_search_result
        }
    ];
    const TagList = [
        {
            name: '电影',
            value: 'Movie'
        },
        {
            name: '剧集',
            value: 'TV'
        }, {
            name: '纪录片',
            value: 'Documentary'
        }, {
            name: '动漫',
            value: 'Anime'
        }, {
            name: '音乐',
            value: 'Music'
        }, {
            name: 'XX',
            value: 'AV'
        }
    ].map((item) => {
        if (appInfo?.server_config?.web_search_default_cates && appInfo?.server_config?.web_search_default_cates.includes(item.value)) {
            item.checked = true;
        } else {
            item.checked = false;
        }
        return item;
    });
    const [site, setSite] = useState();
    const [category, setCategory] = useState(TagList.reduce((a, v) => ({...a, [v.value]: v.checked}), {}));
    const [searchContent, setSearchContent] = useState(SearchContent.reduce((a, v) => ({
        ...a,
        [v.value]: v.checked
    }), {}));
    useEffect(() => {
        if (siteData?.data) {
            setSite(siteData.data.reduce((a, v) => ({...a, [v.site_name]: v.web_search === 1}), {}))
        }
    }, [siteData])
    useEffect(() => {
        const cates = Object.keys(category).map((key) => {
            if (category[key]) {
                return key
            }
        }).filter(x => x);
        if (cates) {
            if (cates.length === 1 && cates.includes("AV")) {
                setSearchContent({...searchContent, searchDouban: false, searchSite: true})
            } else {
                setSearchContent({...searchContent, searchDouban: true})
            }
        }
    }, [category])
    const handleClose = () => {
        // 重置状态
        // setSite();
        // setCategory(undefined);
        onClose();
    }
    const [showSetting, setShowSetting] = useState(false);
    return (
        <Dialog open={open} TransitionComponent={Transition} onClose={handleClose} fullScreen={isFullScreen}>
            <DialogContentWrap>
                <DialogTitle>
                    <IconButton
                      aria-label="close"
                      onClick={onClose}
                      sx={{
                          position: 'absolute',
                          right: 8,
                          top: 8,
                          color: (theme) => theme.palette.grey[500],
                      }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <SearchMenu />
                <TopSearch
                    onClose={handleClose}
                    site={site && Object.keys(site).map((key) => {
                        if (site[key]) {
                            return key
                        }
                    }).filter(x => x)}
                    category={category && Object.keys(category).map((key) => {
                        if (category[key]) {
                            return key
                        }
                    }).filter(x => x)}
                    searchContent={searchContent}
                />
                <SearchHistory sx={{mt: 8, mb: 5}} onClose={handleClose}/>
                <OpenExtend
                  openText="展开详细设置"
                  closeText="收起详细设置"
                  sx={{my: 2}}
                  onClick={(val)=>setShowSetting(val)}
                />
                <SearchTag
                    sx={{mt: 4, mb: 5, display: showSetting ? 'block' : 'none'}}
                    title='内容'
                    list={SearchContent}
                    onClick={(name, value) => setSearchContent({...searchContent, [name]: value})}
                    checkData={searchContent}
                />
                <SearchTag
                    sx={{mt: 4, mb: 5, display: showSetting ? 'block' : 'none'}}
                    title='站点'
                    list={siteData?.data?.map((item) => {
                        return {
                            name: item.alias,
                            value: item.site_name
                        }
                    })}
                    onClick={(name, value) => setSite({...site, [name]: value})}
                    checkData={site}
                />
                <SearchTag
                  sx={{mt: 4, mb: 5, display: showSetting ? 'block' : 'none'}}
                  title='分类'
                  list={TagList}
                  onClick={(name, value) => setCategory({...category, [name]: value})}
                  checkData={category}
                />

            </DialogContentWrap>
        </Dialog>
    )
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DialogContentWrap = styled(DialogContent)`
  ${(props) => props.theme.breakpoints.up("sm")} {
    height: 650px;
    width: 600px;
  }
`;

export default SearchDialog;