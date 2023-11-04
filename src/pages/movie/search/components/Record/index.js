import {
  Box,
  CardActionArea,
  CardMedia,
  Chip as MuiChip,
  Grid,
  Link,
  Skeleton,
  Stack,
  Typography as MuiTypography
} from "@mui/material";
import styled, { css } from "styled-components/macro";
import {
  StyledCard as Card,
  StyledCardContent as CardContent,
  StyledIconHolder as IconHolder,
  StyledTypography as Typography
} from "./StyledComp.js";

import { ArrowDown, ArrowUp, Download, File } from "react-feather";
import React, { useEffect } from "react";
import { rgba } from "polished";
import { deepOrange, green } from "@mui/material/colors";
import { coverSize } from "@/utils/PtUtils";
import { useGetTorrentDetail } from "@/api/SiteApi";
import message from "@/utils/message";

const CardMediaWrapper = styled(CardMedia)`
  ${(props) => props.theme.breakpoints.up("sm")} {
    height: 400;
  }
`;
const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;
const Percentage = styled(MuiTypography)`
  span {
    color: ${(props) => props.percentagecolor};
    font-weight: ${(props) => props.theme.typography.fontWeightBold};
    background: ${(props) => rgba(props.percentagecolor, 0.1)};
    padding: 2px;
    border-radius: 3px;
    margin-right: ${(props) => props.theme.spacing(2)};
  }

  ${(props) =>
          props.illustration &&
          props.theme.palette.mode !== "dark" &&
          css`
            color: ${(props) => rgba(props.theme.palette.primary.main, 0.85)};
          `}
`;
const getEpisodeStr = (tvInfo) => {
  if (!tvInfo) {
    return "";
  }
  const episode = tvInfo.ep_full_index;
  if (tvInfo.contains_complete_ep) {
    if (episode.length === 0) {
      return "全集";
    }
    return "全" + episode.length + "集";
  }
  if (episode && episode.length > 0) {
    if (episode.length < 2) {
      return "第" + episode[0] + "集";
    } else {
      return "第" + episode[0] + "-" + episode[episode.length - 1] + "集";
    }
  } else {
    return "";
  }
};
const TorrentTitle = ({
                        siteName,
                        cnName,
                        enName,
                        mediaType,
                        releaseYear,
                        linkUrl,
                        seasonNumberStart,
                        seasonNumberEnd,
                        episodes
                      }) => {
  const getTitle = () => {
    let title = "";
    if (cnName) {
      title += cnName;
    } else {
      title += enName;
    }
    if (mediaType === "TV") {
      if (!seasonNumberEnd) {
        title += ` 第${seasonNumberStart}季${episodes ? " " + episodes : ""}`;
      } else if (seasonNumberStart) {
        title += ` 第${seasonNumberStart}-${seasonNumberEnd}季`;
      }
    }
    if (releaseYear) {
      title += `(${releaseYear})`;
    }
    return (<Link target="_blank" href={linkUrl} color="inherit">{title}</Link>);
  };
  return (
    <Typography gutterBottom variant="h5" component="h2" sx={{ height: 40 }}>
      {cnName || enName ?
        getTitle() :
        <Skeleton />}
    </Typography>
  );
};
const COM = ({
               id,
               site_id,
               onDownload,
               subject,
               details_url,
               name,
               site_name,
               upload,
               download,
               media_source,
               media_encoding,
               resolution,
               file_size,
               download_volume_factor,
               upload_volume_factor,
               minimum_ratio,
               free_desc,
               poster_url,
               cate_level1,
               releaseYear,
               mediaType,
               cnName,
               enName,
               tvInfo,
               onLoading, setImageCarousel
             }) => {
  const { mutate: getDetail, isLoading } = useGetTorrentDetail();
  useEffect(() => {
    onLoading(isLoading);
  }, [isLoading]);
  let free = "";
  if (upload_volume_factor === 2) {
    free = "2x";
  }
  if (download_volume_factor !== 1) {
    switch (download_volume_factor) {
      case 0:
        free += "Free";
        break;
      case 0.5:
        free += "50%";
        break;
      case 0.3:
        free += "30%";
        break;
      default:
        free += "";
        break;
    }
  }
  const picOnClick = () => {
    getDetail({ site_id: site_id, url: details_url }, {
      onSuccess: res => {
        const { code, data } = res;
        if (!data) {
          message.warn(`${site_name}暂不支持查看种子详情！`);
        } else {
          setImageCarousel({
            open: true,
            title: subject,
            images: data.images.map(item => ({ url: item }))
          });
        }
      }
    });
  };
  const handleImageError = (event) => {
    event.target.src = "/static/img/not_found_image.jpeg"; // 当图片加载失败时，设置默认图片路径
  };
  return (<Card>
      {cate_level1 && cate_level1 === "AV" && poster_url && <CardActionArea><CardMedia
        component="img"
        image={poster_url}
        onError={handleImageError}
        onClick={picOnClick}
        sx={{ height: 350, objectFit: "contain" }}
      /></CardActionArea>}
      <CardContent>
        <TorrentTitle cnName={cnName} enName={enName} releaseYear={releaseYear} mediaType={mediaType}
                      linkUrl={details_url} seasonNumberStart={tvInfo?.season_start}
                      seasonNumberEnd={tvInfo?.season_end}
                      episodes={getEpisodeStr(tvInfo)}
        />
        <div>
          <Stack direction="row" spacing={1}>
            {media_source ?
              <Chip label={media_source} color="primary" /> : null}
            {resolution ? <Chip label={resolution} color="success" /> : null}
            {media_encoding ?
              <Chip label={media_encoding} color="info" /> : null}
          </Stack>
        </div>
        <Typography mb={4} color="body2" component="p" sx={{ height: 40 }}>
          {(subject || name) ? `[${site_name}] ${subject ? subject : name}` : <Skeleton />}
        </Typography>
        <Typography mb={4} color="textSecondary" component="p">
          {name !== null && name !== undefined ? `${name}` : <Skeleton />}
        </Typography>
        {upload !== undefined ? <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              {upload}
            </Grid>
            <Grid item>
              <IconHolder>
                <ArrowUp />
              </IconHolder>
            </Grid>
            <Grid item>
              {download}
            </Grid>
            <Grid item>
              <IconHolder>
                <ArrowDown />
              </IconHolder>
            </Grid>
            <Grid item>
              {coverSize(file_size)}
            </Grid>
            <Grid item>
              <IconHolder>
                <File />
              </IconHolder>
            </Grid>
            {download_volume_factor !== 1 ? (
              <Grid item>
                <Percentage
                  variant="subtitle2"
                  color="textSecondary"
                  percentagecolor={green[500]}
                >
                  <span>{free}</span> {free_desc ? "限时：" + free_desc : ""}
                </Percentage>
              </Grid>
            ) : null}
            {minimum_ratio > 0 ? (<Grid item>
              <Percentage
                variant="subtitle2"
                color="textSecondary"
                percentagecolor={deepOrange[500]}
              >
                <span>H&R</span>
              </Percentage>
            </Grid>) : null}
          </Grid>
          <Download onClick={onDownload} />
        </Box> : <Box sx={{ display: "flex", alignItems: "flex-end" }}>
          <Grid container alignItems="center" spacing={1}>
            <Grid item>
              <Skeleton width={30} />
            </Grid>
            <Grid item>
              <Skeleton width={30} />
            </Grid>
            <Grid item>
              <Skeleton width={30} />
            </Grid>
          </Grid>
          <Skeleton width={20} height={20} />
        </Box>}
      </CardContent>
    </Card>
  );
};

export default COM;