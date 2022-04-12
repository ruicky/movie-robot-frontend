import {Grid, LinearProgress} from "@mui/material";
import {ArrowDown, ArrowUp} from "react-feather";
import React, {useEffect, useState} from "react";
import styled from "styled-components/macro";
import {downloading, getDownloading} from "@/utils/download_record";


export default function DownloadBar(props) {
  const { downloading } = props;

  let itemDownloading = { progress: 0, ...downloading };
  return(
    <div>
      <LinearProgress my={2} variant="determinate" value={itemDownloading?.progress} />
      <Grid mb={2} container alignItems="center" spacing={1}>
        <Grid item>
          {itemDownloading?.dlspeed_str}
        </Grid>
        <Grid item>
          <IconHolder>
            <ArrowDown />
          </IconHolder>
        </Grid>
        <Grid item>
          {itemDownloading?.upspeed_str}
        </Grid>
        <Grid item>
          <IconHolder>
            <ArrowUp />
          </IconHolder>
        </Grid>
        <Grid item>
          {itemDownloading?.size_str}
        </Grid>
      </Grid>
    </div>
  )
}

const IconHolder = styled.span`
  display: flex;
  padding-right: ${(props) => props.theme.spacing(2)};
  svg {
    width: 14px;
    height: 14px;
  }
`;
