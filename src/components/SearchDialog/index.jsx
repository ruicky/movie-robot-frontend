import React, {useContext, useEffect, useState} from 'react';
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, Stack} from '@mui/material';
import styled from "styled-components/macro";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopSearch from './TopSearch';
import SearchTag from './SearchTag';
import SearchHistory from './SearchHistory'
import {AppInfoContext} from "@/contexts/AppSetting";
import {useGetMySites} from "@/api/SiteApi";
import CloseIcon from '@mui/icons-material/Close';
import OpenExtend from "@/components/SearchDialog/OpenExtend";
import SearchTemplate from "@/components/SearchDialog/SearchTemplate";

const SearchContent = [
    {
        name: "豆瓣",
        value: "searchDouban",
    },
    {
        name: "媒体库",
        value: "searchMediaServer",
    },
    {
        name: "资源站",
        value: "searchSite",
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
]
const SearchDialog = ({open, onClose}) => {
    const appInfo = useContext(AppInfoContext)
    const {data: siteData} = useGetMySites();
    const [templates, setTemplates] = useState(
        [
            {
                type: 'default',
                name: '默认',
                option: {
                    searchContent: ['searchDouban', 'searchMediaServer', appInfo?.server_config?.auth_search_result === undefined || appInfo?.server_config?.auth_search_result ? 'searchSite' : null],
                    category: appInfo?.server_config?.web_search_default_cates,
                    site: null
                }
            }
        ]
    )
    const [selectedTemplate, setSelectedTemplate] = useState('default');
    const theme = useTheme();
    const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [site, setSite] = useState();
    const [category, setCategory] = useState();
    const [searchContent, setSearchContent] = useState();
    const [showSetting, setShowSetting] = useState(false);
    useEffect(() => {
        if (!templates || templates.length === 0) {
            return;
        }
        if (!selectedTemplate) {
            return;
        }
        const tmpl = templates.filter((item) => item.type === selectedTemplate);
        if (!tmpl || tmpl.length === 0) {
            return;
        }
        const option = tmpl[0].option;
        setSite(siteData?.data?.reduce((a, v) => ({
            ...a,
            [v.site_name]: !option?.site ? v.web_search === 1 : Boolean(option?.site?.includes(v.site_name))
        }), {}))
        setSearchContent(SearchContent.reduce((a, v) => ({
            ...a,
            [v.value]: Boolean(option?.searchContent?.includes(v.value))
        }), {}))
        setCategory(TagList.reduce((a, v) => ({...a, [v.value]: Boolean(option?.category?.includes(v.value))}), {}))
    }, [selectedTemplate, siteData])
    const handleClose = () => {
        // 重置状态
        // setSite();
        // setCategory(undefined);
        onClose();
    }
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
                        <CloseIcon/>
                    </IconButton>
                </DialogTitle>
                <SearchTemplate templates={templates} templateType={selectedTemplate}
                                setTemplateType={setSelectedTemplate}/>
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
                    onClick={(val) => setShowSetting(val)}
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
                {showSetting && <Stack spacing={2}>
                    {selectedTemplate === 'default' && <Button
                        size="medium"
                        variant="contained"
                        color="success"
                        fullWidth
                    >
                        保存新分类
                    </Button>}
                    {selectedTemplate !== 'default' && <Button
                        size="medium"
                        variant="contained"
                        color="error"
                        fullWidth
                    >
                        删除电影分类
                    </Button>}
                </Stack>}
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