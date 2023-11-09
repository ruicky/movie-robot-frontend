import React, { useCallback, useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";
import axios from "../../../utils/request";
import { useUrlQueryParam } from "@/hooks/useUrlQueryParam";
import DropDownBox from "@/components/DropDownBox";
import Empty from "@/components/Empty";
import SubscribeList from "./components/SubscribeList";
import FolderIcon from "@mui/icons-material/Folder";
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Snackbar,
  Switch,
  Typography,
} from "@mui/material";
import { spacing } from "@mui/system";
import Record from "./components/Record";
import MediaServerSearch from "@/pages/movie/search/MediaServerSearch";
import { FilterOptionsProvider } from "@/contexts/FilterOptionsProvider";
import { AppInfoContext } from "@/contexts/AppSetting";
import ImageCarouselDialog from "@/pages/movie/search/components/Record/ImageCarouselDialog";
import Drawer from "@mui/material/Drawer";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";

const StyledDivider = styled(Divider)(spacing);

const TagFileter = ({ filter, data, onFilter }) => {
  let list = [
    { name: "站点", dataKey: "sites" },
    { name: "年份", dataKey: "movie_release_year" },
    { name: "来源", dataKey: "source" },
    { name: "分辨率", dataKey: "resolution" },
    { name: "编码", dataKey: "encode" },
  ];
  if ("season" in data) {
    list.push({ name: "季度", dataKey: "season" });
  }
  if ("episode" in data) {
    list.push({ name: "集数", dataKey: "episode" });
  }
  const obj2Array = (obj) => {
    const arr = Object.keys(obj)
      .map((key) => ({ name: key, value: obj[key] }))
      .sort((a, b) => {
        if (a.name === "全部") {
          return -1;
        }
        if (b.name === "全部") {
          return 1;
        }
        return a.value - b.value;
      });
    return arr;
  };
  const FilterWrapper = styled(Box)`
    position: sticky;
    top: 56px;

    ${(props) => props.theme.breakpoints.up("sm")} {
      top: 64px;
    }

    z-index: 100;
    overflow-x: scroll;
    -webkit-overflow =
    scroling: touch;
    background: ${(props) => props.theme.palette.background.default};

    &::-webkit-scrollbar {
      display: none
    }
  `;

  const [showDrawer, setShowDrawer] = useState(false);
  const toggleDrawer = () => {
    setShowDrawer(!showDrawer);
  };

  return (
    <FilterWrapper
      sx={{
        my: 2,
      }}
    >
      <div className="tw-hidden md:tw-flex">
        {list.map((item) => {
          return (
            <DropDownBox
              key={item.dataKey}
              label={item.name}
              sx={{ minWidth: "80px" }}
              value={Object.keys(data[item.dataKey]).find(
                (value) => data[item.dataKey][value] === filter[item.dataKey]
              )}
              data={obj2Array(data[item.dataKey])}
              onChange={(value) => {
                onFilter({ ...filter, [item.dataKey]: value });
              }}
            />
          );
        })}
      </div>
      <div className="md:tw-hidden tw-flex tw-justify-start">
        <div onClick={toggleDrawer}>
          <div className="tw-p-2 tw-flex tw-items-center tw-justify-center">
            筛选
            {showDrawer ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />}
          </div>
        </div>
        <Drawer
          container={document.getElementById("root")}
          anchor="bottom"
          open={showDrawer}
          onClose={toggleDrawer}
        >
          <div className="tw-py-4">
            <div className="tw-px-4 tw-text-start tw-text-lg tw-font-bold tw-p-2">选择筛选项</div>
            <div className="tw-px-4 tw-overflow-y-auto tw-max-h-[60vh]">
              {list.map((item) => {
                return (
                  <div className="tw-mb-2" key={item.dataKey}>
                    <div className="tw-opacity-70">{item.name}</div>
                    <div className="tw-pt-2 tw-grid tw-grid-cols-5 tw-gap-1">
                      {obj2Array(data[item.dataKey]).map((value) => {
                        return (
                          <Button
                            size="small"
                            key={value.name}
                            variant={
                              filter[item.dataKey] === value.value ||
                              ((!filter[item.dataKey] || filter[item.dataKey] === "全部") &&
                                value.name === "全部")
                                ? "contained"
                                : "outlined"
                            }
                            onClick={() => {
                              onFilter({ ...filter, [item.dataKey]: value.value });
                            }}
                          >
                            {value.name}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Drawer>
      </div>
    </FilterWrapper>
  );
};
const PathPicker = ({ downloadInfo, onClose: close, setMessage }) => {
  const [paths, setPaths] = useState([]);
  const [betterVersion, setBetterVersion] = useState(false);
  const [confirmPath, setConfirmPath] = useState(null);
  useEffect(() => {
    axios
      .get("/api/download/paths", {
        params: {},
      })
      .then((res) => {
        const { data } = res;
        setPaths(data);
      });
  }, []);

  const downloadRequest = useCallback(
    (path, betterVersion) => {
      const { id, site_id } = downloadInfo;
      axios
        .get("/api/download/torrent", {
          params: { id, site_id, save_path: path, better_version: betterVersion },
        })
        .then(({ code, message }) => {
          setConfirmPath(null);
          close();
          setMessage(message);
        });
    },
    [downloadInfo]
  );
  return (
    <>
      <Dialog
        open={!!confirmPath}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">确认要下载吗?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            <Typography variant="h5">保存路径: {confirmPath}</Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setConfirmPath(null);
            }}
          >
            取消
          </Button>
          <Button
            onClick={() => {
              downloadRequest(confirmPath, betterVersion);
            }}
          >
            确定
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={!!downloadInfo} onClose={close} maxWidth={"xs"} fullWidth>
        <DialogTitle>要保存到哪里？</DialogTitle>
        <List sx={{ pt: 0 }}>
          {paths.map((path, index) => (
            <ListItem key={path}>
              <ListItemButton onClick={() => setConfirmPath(path)}>
                <ListItemAvatar>
                  <FolderIcon />
                </ListItemAvatar>
                <ListItemText primary={path} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <DialogActions sx={{ justifyContent: "flex-start" }}>
          <FormControlLabel
            sx={{ ml: 3 }}
            control={
              <Switch
                checked={betterVersion}
                name="betterVersion"
                onChange={(e) => setBetterVersion(e.target.checked)}
              />
            }
            label="下载完成后自动替换掉媒体服务器的旧版"
          />
        </DialogActions>
      </Dialog>
    </>
  );
};

function SearchRecords(props) {
  const appInfo = useContext(AppInfoContext);
  const [records, setRecords] = useState();
  const [tagResource, setTagResource] = useState({
    sites: { 全部: "全部" },
    encode: { 全部: "全部" },
    source: { 全部: "全部" },
    resolution: { 全部: "全部" },
    movie_release_year: { 全部: "全部" },
  });
  const [filter, setFilter] = useState({
    sites: "全部",
    encode: "全部",
    source: "全部",
    resolution: "全部",
    movie_release_year: "全部",
  });
  const [loading, setLoading] = useState(false);
  const [downloadInfo, setDownloadInfo] = useState();
  const [tagVersion, setTagVersion] = useState(Date.now());
  const [param, setParam] = useUrlQueryParam([
    "keyword",
    "site_id",
    "cates",
    "cache",
    "searchDouban",
    "searchMediaServer",
    "searchSite",
  ]);
  const [message, setMessage] = useState(false);
  const [pageIsLoading, setPageIsLoading] = useState(false);
  const [imageCarousel, setImageCarousel] = useState({ open: false, images: [] });
  const searchData = (keyword) => {
    if (keyword !== undefined && keyword !== null && !loading) {
      setLoading(true);
      setRecords(null);
      setParam({ keyword, searchSite: "true" });
      axios
        .get("/api/movie/search_keyword", {
          params: {
            keyword: keyword,
            cates: param.cates,
            site_id: param.site_id,
            cache: param.cache,
            searchDouban: param.searchDouban,
            searchMediaServer: param.searchMediaServer,
            searchSite: true,
          },
        })
        .then((res) => {
          setLoading(false);
          if (!res.error) {
            const sites = { 全部: "全部" };
            const encode = { 全部: "全部" };
            const source = { 全部: "全部" };
            const resolution = { 全部: "全部" };
            const releaseYear = { 全部: "全部" };
            const torrents = res.data.torrents;
            let tips = `在${res.data.site_names.length}个站点搜索到${torrents.length}条结果，其中${res.data.max_run_site_name}最慢，耗费${res.data.max_run_time}秒`;
            if (res.data.run_timeout_names && res.data.run_timeout_names.length > 0) {
              tips += "(" + res.data.run_timeout_names.join(";") + "超时无结果)";
            }
            setMessage(tips);
            // eslint-disable-next-line no-unused-vars
            let movieCnt = 0;
            let tvCnt = 0;
            const seasonNumbers = new Set();
            const episodeNumbers = new Set();
            torrents.forEach(
              ({
                site_name,
                media_encoding,
                media_source,
                resolution: _rs,
                movie_release_year,
                movie_type,
                tv_series,
              }) => {
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
                if (movie_type === "TV") {
                  tvCnt++;
                  if (tv_series) {
                    for (const s of tv_series.season_full_index) {
                      seasonNumbers.add(s);
                    }
                    for (const s of tv_series.ep_full_index) {
                      episodeNumbers.add(s);
                    }
                  }
                } else {
                  movieCnt++;
                }
              }
            );

            if (tvCnt > torrents.length * 0.5) {
              const season = { 全部: "全部" };
              const episode = { 全部: "全部" };
              Array.from(seasonNumbers).forEach((value) => (season[`第${value}季`] = value));
              Array.from(episodeNumbers).forEach((value) => {
                episode[`第${value}集`] = value;
              });
              setTagResource({
                sites,
                encode,
                source,
                resolution,
                movie_release_year: releaseYear,
                season,
                episode,
              });
            } else {
              setTagResource({
                sites,
                encode,
                source,
                resolution,
                movie_release_year: releaseYear,
              });
            }
            setRecords(torrents);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    if (param.searchDouban === "") {
      setParam({ ...param, searchDouban: true });
    }
    if (param.searchMediaServer === "") {
      setParam({ ...param, searchMediaServer: true });
    }
    setFilter({ encode: "全部", source: "全部", resolution: "全部" });
    setTagVersion(Date.now());
    if (param?.searchSite && param?.searchSite === "true") {
      searchData(param.keyword);
    } else {
      setRecords(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [param]);
  const isHaveData = records && records.length > 0;
  return (
    <React.Fragment>
      <Helmet title={param?.keyword ? param.keyword + " - 搜索结果" : "搜索"} />
      {isHaveData && (
        <>
          <TagFileter key={tagVersion} filter={filter} data={tagResource} onFilter={setFilter} />
          <StyledDivider my={2} />
        </>
      )}
      {param?.keyword && param?.searchMediaServer && param?.searchMediaServer === "true" && (
        <MediaServerSearch keyword={param?.keyword} />
      )}
      {param?.keyword && param?.searchDouban && param?.searchDouban === "true" && (
        <FilterOptionsProvider>
          <SubscribeList
            keyword={param?.keyword}
            posterWall={Boolean(appInfo?.server_config?.douban_poster_wall)}
          />
        </FilterOptionsProvider>
      )}
      {pageIsLoading && (
        <Box
          sx={{
            position: "fixed", // 使用 fixed 定位，这样它会相对于视口固定位置
            top: 0,
            left: 0,
            width: "100%", // 宽度和高度设置为100%，以覆盖整个屏幕
            height: "100%",
            display: "flex", // 使用 Flexbox 来居中 CircularProgress
            justifyContent: "center", // 水平居中
            alignItems: "center", // 垂直居中
            zIndex: 1500, // zIndex 要足够高，以确保遮罩层位于最上面
            backgroundColor: "rgba(0, 0, 0, 0.5)", // 半透明背景
          }}
        >
          <CircularProgress />
        </Box>
      )}
      <ImageCarouselDialog
        open={imageCarousel.open}
        onClose={() => setImageCarousel({ open: false, images: [], title: "" })}
        images={imageCarousel.images}
        title={imageCarousel.title}
      />
      <Grid container spacing={4}>
        {(loading ? Array.from(new Array(4)) : records || [])
          .filter((item) => {
            if (!item) return true;
            const {
              site_name,
              resolution,
              media_source,
              media_encoding,
              movie_release_year,
              tv_series,
            } = item;
            return Object.keys(filter).every((key) => {
              const filterValue = filter[key];
              if (!filterValue || filterValue === "全部") return true;
              switch (key) {
                case "sites":
                  return filterValue === site_name;
                case "resolution":
                  return filterValue === resolution;
                case "source":
                  return filterValue === media_source;
                case "encode":
                  return filterValue === media_encoding;
                case "movie_release_year":
                  return filterValue === movie_release_year;
                case "season":
                  return tv_series?.season_full_index?.includes(filterValue);
                case "episode":
                  return tv_series?.ep_full_index?.includes(filterValue);
                default:
                  return false;
              }
            });
          })

          .map((row, index) => (
            <Grid key={index} item xs={12} lg={6} xl={6}>
              <Record
                id={row?.id}
                site_id={row?.site_id}
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
                  const { id, site_id } = row;
                  setDownloadInfo({ id, site_id });
                }}
                onLoading={(isLoading) => {
                  setPageIsLoading(isLoading);
                }}
                setImageCarousel={setImageCarousel}
              />
              {/* 这里可以显示本地库的搜索结果 */}
              {/* <MediaCard /> */}
            </Grid>
          ))}
      </Grid>
      {records && records.length === 0 && (
        <Empty message={`没有搜索到任何资源 站点：${param.site_id} 分类：${param.cates}`} />
      )}
      {param?.searchSite &&
        param?.searchSite !== "true" &&
        (param?.cache === "" || param?.cache === "false") &&
        !records &&
        !loading && (
          <Box mt={6}>
            <Button
              variant="contained"
              color="info"
              fullWidth
              onClick={() => searchData(param.keyword)}
            >
              立即搜索资源
            </Button>
          </Box>
        )}
      <PathPicker
        downloadInfo={downloadInfo}
        onClose={() => {
          setDownloadInfo(null);
        }}
        setMessage={setMessage}
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
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
