import React, {useCallback, useEffect, useState} from "react";
import styled from "styled-components/macro";
import {Search as SearchIcon} from "@mui/icons-material";
import {Helmet} from "react-helmet-async";
import axios from "../../../utils/request";
import {useUrlQueryParam} from '@/hooks/useUrlQueryParam';

import {
    Box,
    CircularProgress,
    Divider,
    FormControl,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    List,
    ListItem,
    ListItemText,
    MenuItem,
    OutlinedInput,
    Select,
    Snackbar,
    SwipeableDrawer
} from "@mui/material";
import {spacing} from "@mui/system";
import Record from "./components/Record";

const StyledDivider = styled(Divider)(spacing);
const SelectTag = ({label, value, data, onChange}) => {
    const Items = Object.keys(data || {}).map((key) => {
        return (
            <MenuItem value={key} key={key}>
                {key}
            </MenuItem>);
    });
    return (
        <FormControl variant="outlined" sx={{m: 1, width: "30%", margin: 0}}>
            <InputLabel>{label}</InputLabel>
            <Select
                displayEmpty
                value={value}
                onChange={({target: {value}}) => {
                    onChange(value);
                }}
                label={label}
            >
                {Items}
            </Select>
        </FormControl>
    );
};

const TagFileter = ({filter, data, onFilter}) => {
    return (
        <Box sx={{display: "flex", justifyContent: "space-between", marginTop: "10px"}}>
            <SelectTag
                label="来源"
                data={data.source}
                value={filter.source}
                onChange={(value) => {
                    onFilter({...filter, source: value});
                }}
            />
            <SelectTag
                label="分辨率"
                data={data.resolution}
                value={filter.resolution}
                onChange={(value) => {
                    onFilter({...filter, resolution: value});
                }}
            />
            <SelectTag
                label="编码"
                data={data.encode}
                value={filter.encode}
                onChange={(value) => {
                    onFilter({...filter, encode: value});
                }}
            />
        </Box>
    );
};

const SearchBar = ({onSearch, ...props}) => {
    const [value, setValue] = useState();
    return (
        <FormControl fullWidth sx={{flexDirection: "row"}}>
            <OutlinedInput
                autoFocus
                sx={{paddingRight: 0}}
                fullWidth
                placeholder="输入搜索内容"
                variant="outlined"
                onChange={({target: {value: v}}) => {
                    setValue(v);
                }}
                onKeyUp={({code}) => {
                    if ((code === "Enter" || code === "NumpadEnter") && value) {
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
    );
};

const PathPicker = ({downloadInfo, onClose: close}) => {
    const [paths, setPaths] = useState([]);
    const [message, setMessage] = useState(false);
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
            <Snackbar
                open={!!message}
                autoHideDuration={3000}
                onClose={() => {
                    setMessage(null);
                }}
                message={message}
            ></Snackbar>
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
        encode: {"全部": "全部"},
        source: {"全部": "全部"},
        resolution: {"全部": "全部"}
    });
    const [filter, setFilter] = useState({encode: "全部", source: "全部", resolution: "全部"});
    const [loading, setLoading] = useState(false);
    const [downloadInfo, setDownloadInfo] = useState();
    const [tagVersion, setTagVersion] = useState(Date.now());
    const [param, setParam] = useUrlQueryParam(["keyword"]);
    console.log('param-->', param);

    const searchData = (keyword) => {
        if (keyword) {
            setLoading(true);
            setRecords();
            setParam({keyword})
            axios.get("/api/movie/search_keyword", {
                params: {
                    keyword: keyword,
                    rule_name: "compress"
                }
            }).then((res) => {
                setLoading(false);
                if (!res.error) {
                    const encode = {"全部": "全部"};
                    const source = {"全部": "全部"};
                    const resolution = {"全部": "全部"};
                    res.data.forEach(({media_encoding, media_source, resolution: _rs}) => {
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
                        encode,
                        source,
                        resolution
                    });
                    setRecords(res.data);
                }
            }).catch(() => {
                setLoading(false);
            });
        }
    }

    useEffect(() => {
        searchData(param.keyword)
    }, [param])

    const search = useCallback((keyword) => {
        searchData(keyword)
    });
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
            <TagFileter
                key={tagVersion}
                filter={filter}
                data={tagResource}
                onFilter={setFilter}
            />
            <StyledDivider my={4}/>
            {loading && <CircularProgress sx={{position: "absolute", top: "50%", left: "50%", marginLeft: "-20px"}}/>}
            {
                (records && records.length > 0) &&
                <Grid container spacing={4}>
                    {
                        records.filter(({resolution, media_source, media_encoding}) => {
                            let bool = true;
                            Object.keys(filter).forEach((key) => {
                                const item = filter[key];
                                bool = bool && (!item || item === "全部" || item === resolution || item === media_source || item === media_encoding);
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
                records && records.length === 0 && <div>没有找到任何结果!</div>
            }
            <PathPicker
                downloadInfo={downloadInfo}
                onClose={() => {
                    setDownloadInfo(null);
                }}
            />
        </React.Fragment>
    );
}

export default DownloadRecords;
