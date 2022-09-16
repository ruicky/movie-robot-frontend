import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components/macro";
import {Search as SearchIcon} from "@mui/icons-material";
import {Helmet} from "react-helmet-async";
import axios from "../../../utils/request";
import {useUrlQueryParam} from '@/hooks/useUrlQueryParam';
import DropDownBox from '@/components/DropDownBox';
import Empty from '@/components/Empty';
import SubscribeList from './components/SubscribeList';

import {
    Box,
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText,
    OutlinedInput,
    Snackbar,
    SwipeableDrawer,
    Typography
} from "@mui/material";
import {spacing} from "@mui/system";
import Record from "./components/Record";
import MediaServerSearch from "@/pages/movie/search/MediaServerSearch";
import {FilterOptionsProvider} from "@/components/Selectors/FilterOptionsProvider";

const StyledDivider = styled(Divider)(spacing);

const TagFileter = ({filter, data, onFilter}) => {
    const list = [
        {name: '站点', dataKey: 'sites'},
        {name: '年份', dataKey: 'movie_release_year'},
        {name: '来源', dataKey: 'source'},
        {name: '分辨率', dataKey: 'resolution'},
        {name: '编码', dataKey: 'encode'},
    ]
    const obj2Array = obj => {
        return Object.keys(obj).map(key => ({name: key, value: obj[key]}))
    }
    const FilterWrapper = styled(Box)`
        position: sticky;
        top: 56px;
        ${(props) => props.theme.breakpoints.up("sm")} {
            top: 64px;
        }
        z-index: 100;
        background: ${(props) => props.theme.palette.background.default};
    `;
    return (
        <FilterWrapper sx={{
            display: "flex",
            my: 2,
        }}>
            {
                list.map((item) => {
                    return (
                        <DropDownBox
                            key={item.dataKey}
                            label={item.name}
                            value={filter[item.dataKey]}
                            data={obj2Array(data[item.dataKey])}
                            onChange={(value) => {
                                onFilter({...filter, [item.dataKey]: value});
                            }}
                        />
                    )
                })
            }
        </FilterWrapper>
    );
};
const PathPicker = ({downloadInfo, onClose: close, setMessage}) => {
    const [paths, setPaths] = useState([]);
    const [betterVersion, setBetterVersion] = useState(false);
    const [confirmPath, setConfirmPath] = useState(null);
    useEffect(() => {
        axios.get("/api/download/paths", {
            params: {}
        }).then((res) => {
            const {data} = res;
            setPaths(data);
        });
    }, []);

    const downloadRequest = useCallback((path, betterVersion) => {
        const {id, site_id} = downloadInfo;
        axios.get("/api/download/torrent", {
            params: {id, site_id, save_path: path, better_version: betterVersion}
        }).then(({code, message}) => {
            setConfirmPath(null);
            close();
            setMessage(message);
        });

    }, [downloadInfo]);
    return (
        <>
            <Dialog
                open={!!confirmPath}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    确认要下载吗?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography variant="h5">
                            保存路径: {confirmPath}
                        </Typography>
                    </DialogContentText>
                    <Grid>
                        <Grid item>
                            <FormControlLabel
                                control={<Checkbox
                                    checked={betterVersion}
                                    name="betterVersion"
                                    onChange={(e) => setBetterVersion(e.target.checked)}
                                />}
                                label="下载完成后自动替换掉媒体服务器的旧版"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setConfirmPath(null);
                    }}>取消</Button>
                    <Button onClick={() => {
                        downloadRequest(confirmPath, betterVersion)
                    }}>
                        确定
                    </Button>
                </DialogActions>
            </Dialog>
            <SwipeableDrawer
                anchor="bottom"
                open={!!downloadInfo}
                onClose={close}
            >
                <Box
                    role="presentation"
                >
                    <List>
                        {paths.map((text, index) => (
                            <ListItem
                                button
                                key={text}
                                onClick={() => setConfirmPath(text)}
                            >
                                <ListItemText primary={text}/>
                            </ListItem>
                        ))}
                    </List>
                </Box>
            </SwipeableDrawer>
        </>
    );
};


function SearchRecords(props) {
    const [records, setRecords] = useState();
    const [tagResource, setTagResource] = useState({
        sites: {"全部": "全部"},
        encode: {"全部": "全部"},
        source: {"全部": "全部"},
        resolution: {"全部": "全部"},
        movie_release_year: {"全部": "全部"}
    });
    const [filter, setFilter] = useState({
        sites: "全部",
        encode: "全部",
        source: "全部",
        resolution: "全部",
        movie_release_year: "全部"
    });
    const [loading, setLoading] = useState(false);
    const [downloadInfo, setDownloadInfo] = useState();
    const [tagVersion, setTagVersion] = useState(Date.now());
    const [param, setParam] = useUrlQueryParam(["keyword", "site_id", "cates", "cache", "searchDouban", "searchMediaServer", "searchSite"]);
    const [message, setMessage] = useState(false);

    const searchData = (keyword) => {
        if (keyword && !loading) {
            setLoading(true);
            setRecords(null);
            setParam({keyword, searchSite: 'true'});
            axios.get("/api/movie/search_keyword", {
                params: {
                    keyword: keyword,
                    cates: param.cates,
                    site_id: param.site_id,
                    cache: param.cache,
                    searchDouban: param.searchDouban,
                    searchMediaServer: param.searchMediaServer,
                    searchSite: true
                }
            }).then((res) => {
                setLoading(false);
                if (!res.error) {
                    const sites = {"全部": "全部"};
                    const encode = {"全部": "全部"};
                    const source = {"全部": "全部"};
                    const resolution = {"全部": "全部"};
                    const releaseYear = {"全部": "全部"};
                    const torrents = res.data.torrents;
                    let tips = `在${res.data.site_names.length}个站点搜索到${torrents.length}条结果，其中${res.data.max_run_site_name}最慢，耗费${res.data.max_run_time}秒`;
                    if (res.data.run_timeout_names && res.data.run_timeout_names.length > 0) {
                        tips += "(" + res.data.run_timeout_names.join(';') + "超时无结果)"
                    }
                    setMessage(tips);
                    torrents.forEach(({site_name, media_encoding, media_source, resolution: _rs, movie_release_year}) => {
                        if (sites) {
                            sites[site_name] = site_name;
                        }
                        if (media_encoding) {
                            encode[media_encoding] = media_encoding;
                        }
                        if (media_source) {
                            source[media_source] = media_source;
                        }
                        if (_rs) {
                            resolution[_rs] = _rs;
                        }
                        if (movie_release_year) {
                            releaseYear[movie_release_year] = movie_release_year;
                        }
                    });
                    setTagResource({
                        sites,
                        encode,
                        source,
                        resolution,
                        movie_release_year: releaseYear
                    });
                    setRecords(torrents);
                }
            }).catch(() => {
                setLoading(false);
            });
        }
    }

    useEffect(() => {
        if (param.searchDouban === '') {
            setParam({...param, searchDouban: true})
        }
        if (param.searchMediaServer === '') {
            setParam({...param, searchMediaServer: true})
        }
        setFilter({encode: "全部", source: "全部", resolution: "全部"});
        setTagVersion(Date.now());
        if (param?.searchSite && param?.searchSite === 'true') {
            searchData(param.keyword)
        } else {
            setRecords(null);
        }
    }, [param])
    const isHaveData = records && records.length > 0;
    return (<React.Fragment>
            <Helmet title={param?.keyword ? param.keyword + " - 搜索结果" : "搜索"}/>
            {
                isHaveData && <>
                    <TagFileter
                        key={tagVersion}
                        filter={filter}
                        data={tagResource}
                        onFilter={setFilter}
                    />
                    <StyledDivider my={2}/>
                </>
            }
            {param?.keyword && param?.searchMediaServer && param?.searchMediaServer === 'true' &&
            <MediaServerSearch keyword={param?.keyword}/>}
            {param?.keyword && param?.searchDouban && param?.searchDouban === 'true' &&
            <FilterOptionsProvider><SubscribeList keyword={param?.keyword}/></FilterOptionsProvider>}
            <Grid container spacing={4}>
                {
                    (loading ? Array.from(new Array(3)) : records || []).filter((item) => {
                        if (!item) {
                            return true;
                        }
                        const {
                            site_name,
                            resolution,
                            media_source,
                            media_encoding,
                            movie_release_year
                        } = item;
                        let bool = true;
                        Object.keys(filter).forEach((key) => {
                            const item = filter[key];
                            bool = bool && (!item || item === "全部" || item === site_name || item === resolution || item === media_source || item === media_encoding || item === movie_release_year);
                        });
                        return bool;
                    }).map((row, index) => (
                        <Grid key={index} item xs={12} lg={12} xl={12}>
                            <Record
                                name={row?.name}
                                subject={row?.subject}
                                details_url={row?.details_url}
                                site_name={row?.site_name}
                                upload={row?.upload_count}
                                download={row?.download_count}
                                media_source={row?.media_source}
                                media_encoding={row?.media_encoding}
                                resolution={row?.resolution}
                                file_size={row?.size_mb}
                                download_volume_factor={row?.download_volume_factor}
                                upload_volume_factor={row?.upload_volume_factor}
                                free_desc={row?.free_desc}
                                minimum_ratio={row?.minimum_ratio}
                                poster_url={row?.poster_url}
                                cate_level1={row?.cate_level1}
                                releaseYear={row?.movie_release_year}
                                mediaType={row?.movie_type}
                                cnName={row?.cn_name}
                                enName={row?.en_name}
                                tvInfo={row?.tv_series}
                                onDownload={() => {
                                    const {id, site_id} = row;
                                    setDownloadInfo({id, site_id});
                                }}
                            />
                            {/* 这里可以显示本地库的搜索结果 */}
                            {/* <MediaCard /> */}
                        </Grid>
                    ))
                }
            </Grid>
            {
                records && records.length === 0 && <Empty message={`没有搜索到任何资源 站点：${param.site_id} 分类：${param.cates}`}/>
            }
            {
                param?.searchSite && param?.searchSite !== "true" && (param?.cache === '' || param?.cache === 'false') && !records && !loading &&
                <Box mt={6}>
                    <Button
                        variant="contained" color="info" fullWidth
                        onClick={() => searchData(param.keyword)}
                    >
                        立即搜索资源
                    </Button>
                </Box>
            }
            <PathPicker
                downloadInfo={downloadInfo}
                onClose={() => {
                    setDownloadInfo(null);
                }}
                setMessage={setMessage}
            />
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center'
                }}
                open={!!message}
                autoHideDuration={3500}
                onClose={() => {
                    setMessage(null);
                }}
                message={message}
            />
        </React.Fragment>
    );
}

export default SearchRecords;
