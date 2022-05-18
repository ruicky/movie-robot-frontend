import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components/macro";
import {Search as SearchIcon} from "@mui/icons-material";
import {Helmet} from "react-helmet-async";
import axios from "../../../utils/request";
import {useUrlQueryParam} from '@/hooks/useUrlQueryParam';
import DropDownBox from '@/components/DropDownBox';
import Empty from '@/components/Empty';

import {
    Box,
    CircularProgress,
    Divider,
    FormControl, FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    List,
    ListItem,
    ListItemText, MenuItem,
    OutlinedInput, Select,
    Snackbar,
    SwipeableDrawer
} from "@mui/material";
import {spacing} from "@mui/system";
import Record from "./components/Record";

const StyledDivider = styled(Divider)(spacing);

const TagFileter = ({filter, data, onFilter}) => {
    const list = [
        {name: '站点', dataKey: 'sites'},
        {name: '来源', dataKey: 'source'},
        {name: '分辨率', dataKey: 'resolution'},
        {name: '编码', dataKey: 'encode'},
    ]
    const obj2Array = obj => {
        return Object.keys(obj).map(key => ({name: key, value: obj[key]}))
    }
    return (
        <Box sx={{display: "flex", my: 2}}>
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
        </Box>
    );
};

const SearchBar = ({onSearch, ...props}) => {
    const [value, setValue] = useState();
    return (
        <>
        <FormControl fullWidth sx={{flexDirection: "row"}}>
            <Select
                name="type"
                defaultValue="remote"
            >
                <MenuItem value="local">本地</MenuItem>
                <MenuItem value="remote">远程</MenuItem>
            </Select>
            <OutlinedInput
                autoFocus
                sx={{paddingRight: 0}}
                fullWidth
                placeholder="输入搜索内容"
                variant="outlined"
                onChange={({target: {value: v}}) => {
                    setValue(v);
                }}
                onKeyUp={(e) => {
                    if ((e.key === 'Enter' || e.key === "NumpadEnter") && value) {
                        onSearch(value);
                    }
                }}
                value={value}
                {...props}
                endAdornment={
                    <InputAdornment>
                        <IconButton type="submit" sx={{p: "10px"}} aria-label="search" onClick={() => {
                            if (value) {
                                onSearch(value);
                            }
                        }}>
                            <SearchIcon/>
                        </IconButton>
                    </InputAdornment>}
            />
        </FormControl>
            </>
    );
};

const PathPicker = ({downloadInfo, onClose: close, setMessage}) => {
    const [paths, setPaths] = useState([]);
    useEffect(() => {
        axios.get("/api/download/paths", {
            params: {}
        }).then((res) => {
            const {data} = res;
            setPaths(data);
        });
    }, []);

    const downloadRequest = useCallback((path) => {
        const {id, site_id} = downloadInfo;
        axios.get("/api/download/torrent", {
            params: {id, site_id, save_path: path}
        }).then(({code, message}) => {
            setMessage(message);
        });

    }, [downloadInfo]);
    return (
        <>
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
                                onClick={() => {
                                    downloadRequest(text);
                                    close();
                                }}
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


function DownloadRecords(props) {
    const [records, setRecords] = useState();
    const [tagResource, setTagResource] = useState({
        sites: {"全部": "全部"},
        encode: {"全部": "全部"},
        source: {"全部": "全部"},
        resolution: {"全部": "全部"}
    });
    const [filter, setFilter] = useState({sites: "全部", encode: "全部", source: "全部", resolution: "全部"});
    const [loading, setLoading] = useState(false);
    const [downloadInfo, setDownloadInfo] = useState();
    const [tagVersion, setTagVersion] = useState(Date.now());
    const [param, setParam] = useUrlQueryParam(["keyword"]);
    const [message, setMessage] = useState(false);

    const searchData = (keyword) => {
        if (keyword && !loading) {
            setLoading(true);
            setRecords();
            setParam({keyword})
            axios.get("/api/movie/search_keyword", {
                params: {
                    keyword: keyword
                }
            }).then((res) => {
                setLoading(false);
                if (!res.error) {
                    const sites = {"全部": "全部"};
                    const encode = {"全部": "全部"};
                    const source = {"全部": "全部"};
                    const resolution = {"全部": "全部"};
                    const torrents = res.data.torrents;
                    let tips = `在${res.data.site_names.length}个站点搜索到${torrents.length}条结果，其中${res.data.max_run_site_name}最慢，耗费${res.data.max_run_time}秒`;
                    if (res.data.run_timeout_names && res.data.run_timeout_names.length > 0) {
                        tips += "(" + res.data.run_timeout_names.join(';') + "超时无结果)"
                    }
                    setMessage(tips);
                    torrents.forEach(({site_id, media_encoding, media_source, resolution: _rs}) => {
                        if (sites) {
                            sites[site_id] = site_id;
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
                    });
                    setTagResource({
                        sites,
                        encode,
                        source,
                        resolution
                    });
                    setRecords(torrents);
                }
            }).catch(() => {
                setLoading(false);
            });
        }
    }

    useEffect(() => {
        searchData(param.keyword)
    }, [])

    const search = useCallback((keyword) => {
        searchData(keyword)
    });
    const isHaveData = records && records.length > 0;
    return (<React.Fragment>
            <Helmet title="搜索"/>
            <SearchBar
                defaultValue={param?.keyword}
                onSearch={(value) => {
                    setFilter({encode: "全部", source: "全部", resolution: "全部"});
                    setTagVersion(Date.now());
                    search(value);
                }}
            />
            {
                isHaveData && <>
                    <TagFileter
                        key={tagVersion}
                        filter={filter}
                        data={tagResource}
                        onFilter={setFilter}
                    />
                    <StyledDivider my={4}/>
                </>
            }
            {loading && <CircularProgress sx={{position: "absolute", top: "50%", left: "50%", marginLeft: "-20px"}}/>}
            {
                isHaveData &&
                <Grid container spacing={4}>
                    {
                        records.filter(({site_id, resolution, media_source, media_encoding}) => {
                            let bool = true;
                            Object.keys(filter).forEach((key) => {
                                const item = filter[key];
                                bool = bool && (!item || item === "全部" || item === site_id || item === resolution || item === media_source || item === media_encoding);
                            });
                            return bool;
                        }).map((row) => (
                            <Grid item xs={12} lg={12} xl={12}>
                                <Record
                                    subject={row.subject}
                                    key={row.id}
                                    name={row.name}
                                    details_url={row.details_url}
                                    site_name={row.site_id}
                                    upload={row.upload_count}
                                    download={row.download_count}
                                    media_source={row.media_source}
                                    media_encoding={row.media_encoding}
                                    resolution={row.resolution}
                                    file_size={row.size_mb}
                                    download_volume_factor={row.download_volume_factor}
                                    upload_volume_factor={row.upload_volume_factor}
                                    free_desc={row.free_desc}
                                    minimum_ratio={row.minimum_ratio}
                                    onDownload={() => {
                                        const {id, site_id} = row;
                                        setDownloadInfo({id, site_id});
                                    }}
                                />
                            </Grid>
                        ))
                    }
                </Grid>
            }
            {
                records && records.length === 0 && <Empty message="没有找到任何结果!"/>
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

export default DownloadRecords;
