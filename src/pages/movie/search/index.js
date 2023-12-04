import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components/macro";
import { Helmet } from "react-helmet-async";
import { useUrlQueryParam } from "@/hooks/useUrlQueryParam";
import Empty from "@/components/Empty";
import SubscribeList from "./components/SubscribeList";
import { Box, Button, CircularProgress, Divider, Grid, Snackbar } from "@mui/material";
import { spacing } from "@mui/system";
import Record from "./components/Record";
import MediaServerSearch from "@/pages/movie/search/MediaServerSearch";
import { FilterOptionsProvider } from "@/contexts/FilterOptionsProvider";
import { AppInfoContext } from "@/contexts/AppSetting";
import ImageCarouselDialog from "@/pages/movie/search/components/Record/ImageCarouselDialog";
import { TagFileter } from "./components/TagFileter";
import { PathPicker } from "./components/PathPicker";
import axios from "../../../utils/request";
import { getPromotion } from "./utils";

const StyledDivider = styled(Divider)(spacing);

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
            const releaseTeam = { 全部: "全部" };
            const promotion = { 全部: "全部" };
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
                release_team,
                download_volume_factor,
                upload_volume_factor,
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
                if (release_team) {
                  releaseTeam[release_team] = release_team;
                }
                if (upload_volume_factor || download_volume_factor) {
                  const _promotion = getPromotion(upload_volume_factor, download_volume_factor);
                  if (_promotion) promotion[_promotion] = _promotion;
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
            const baseResource = {
              sites,
              encode,
              source,
              resolution,
              movie_release_year: releaseYear,
              releaseTeam,
              promotion,
            };
            if (tvCnt > torrents.length * 0.5) {
              const season = { 全部: "全部" };
              const episode = { 全部: "全部" };
              Array.from(seasonNumbers).forEach((value) => (season[`第${value}季`] = value));
              Array.from(episodeNumbers).forEach((value) => {
                episode[`第${value}集`] = value;
              });
              setTagResource({
                ...baseResource,
                season,
                episode,
              });
            } else {
              setTagResource({
                ...baseResource,
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
              release_team,
              download_volume_factor,
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
                case "releaseTeam":
                  return filterValue === release_team;
                case "downloadVolumeFactor":
                  return filterValue === download_volume_factor;
                case "promotion":
                  return (
                    filterValue ===
                    getPromotion(item.upload_volume_factor, item.download_volume_factor)
                  );
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
