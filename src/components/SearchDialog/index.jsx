import React, {useEffect, useState} from 'react';
import {Button, Dialog, DialogContent, DialogTitle, IconButton, Slide, Stack} from '@mui/material';
import styled from "styled-components/macro";
import {useTheme} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import TopSearch from './TopSearch';
import SearchTag from './SearchTag';
import SearchHistory from './SearchHistory'
import {useGetMySites} from "@/api/SiteApi";
import CloseIcon from '@mui/icons-material/Close';
import OpenExtend from "@/components/SearchDialog/OpenExtend";
import SearchTemplate from "@/components/SearchDialog/SearchTemplate";
import TemplateNameDialog from "@/components/SearchDialog/AddTemplateDialog";
import {
    useAddSearchTemplate,
    useDeleteSearchTemplate,
    useGetSearchTemplate,
    useUpdateSearchTemplate
} from "@/api/SettingApi";
import message from "@/utils/message";

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

function getSelectKeyName(options) {
    if (!options) {
        return null;
    }
    return Object.keys(options).map((k) => {
        if (options[k]) {
            return k
        }
    }).filter(x => x);
}

const SearchDialog = ({open, onClose}) => {
    const {data: siteData} = useGetMySites();
    const {data: searchTemplateData, refetch: refetchSerarchTemplate} = useGetSearchTemplate()
    const [templates, setTemplates] = useState([])
    const [permissionCategory, setPermissionCategory] = useState([])
    const [selectedTemplate, setSelectedTemplate] = useState();
    useEffect(() => {
        if (!searchTemplateData?.data) {
            return;
        }
        setTemplates(searchTemplateData.data?.template.map((item) => {
            item.type = item.name;
            return item
        }));
        setPermissionCategory(searchTemplateData.data?.permission_category)
        setSelectedTemplate(searchTemplateData.data?.template[0].name)
    }, [searchTemplateData])
    const theme = useTheme();
    const isFullScreen = useMediaQuery(theme.breakpoints.down("sm"));
    const [site, setSite] = useState();
    const [category, setCategory] = useState();
    const [searchContent, setSearchContent] = useState();
    const [showSetting, setShowSetting] = useState(false);
    const [showTemplateAdd, setShowTemplateAdd] = useState(false);
    const {mutate: addSearchTemplate} = useAddSearchTemplate();
    const {mutate: updateSearchTemplate} = useUpdateSearchTemplate();
    const {mutate: deleteSearchTemplate} = useDeleteSearchTemplate();
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
        setCategory(TagList.filter(x => permissionCategory?.includes(x.value)).reduce((a, v) => ({
            ...a,
            [v.value]: Boolean(option?.category?.includes(v.value))
        }), {}))
    }, [selectedTemplate, siteData,permissionCategory])
    const handleClose = () => {
        // 重置状态
        // setSite();
        // setCategory(undefined);
        onClose();
    }
    const onAddTemplate = (name) => {
        addSearchTemplate({
            name,
            option: {
                searchContent: getSelectKeyName(searchContent),
                category: getSelectKeyName(category),
                site: getSelectKeyName(site)
            }
        }, {
            onSuccess: res => {
                const {data, code, message: msg} = res;
                if (code === 0) {
                    message.success(msg);
                    refetchSerarchTemplate();
                    setShowTemplateAdd(false);
                } else {
                    message.error(msg)
                }
            },
            onError: error => message.error(error)
        })
    }
    const onUpdateSearchTemplate = () => {
        updateSearchTemplate({
            name: selectedTemplate,
            option: {
                searchContent: getSelectKeyName(searchContent),
                category: getSelectKeyName(category),
                site: getSelectKeyName(site)
            }
        }, {
            onSuccess: res => {
                const {data, code, message: msg} = res;
                if (code === 0) {
                    message.success(msg);
                } else {
                    message.error(msg)
                }
            },
            onError: error => message.error(error)
        })
    }
    const onDeleteSearchTemplate = () => {
        deleteSearchTemplate({
            name: selectedTemplate
        }, {
            onSuccess: res => {
                const {data, code, message: msg} = res;
                if (code === 0) {
                    message.success(msg);
                    refetchSerarchTemplate();
                } else {
                    message.error(msg)
                }
            },
            onError: error => message.error(error)
        })
    }
    return (
        <>
            <TemplateNameDialog open={showTemplateAdd} handleClose={() => setShowTemplateAdd(false)}
                                onSubmit={onAddTemplate}/>
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
                        list={TagList.filter(x => permissionCategory?.includes(x.value))}
                        onClick={(name, value) => setCategory({...category, [name]: value})}
                        checkData={category}
                    />
                    {showSetting && <Stack spacing={2} justifyContent={"center"}>
                        <Button
                            size="medium"
                            variant="contained"
                            color="success"
                            onClick={onUpdateSearchTemplate}
                        >
                            修改{selectedTemplate}配置
                        </Button>
                        {selectedTemplate === '默认' && <Button
                            size="medium"
                            variant="contained"
                            // color="success"
                            onClick={(e) => setShowTemplateAdd(true)}
                        >
                            保存为新模版
                        </Button>}
                        {selectedTemplate !== '默认' && <Button
                            size="medium"
                            variant="contained"
                            color="error"
                            onClick={onDeleteSearchTemplate}
                        >
                            删除模版{selectedTemplate}
                        </Button>}
                    </Stack>}
                </DialogContentWrap>
            </Dialog>
        </>
    );
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