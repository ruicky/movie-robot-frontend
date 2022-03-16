import { Box, Chip as MuiChip, Grid, Stack } from "@mui/material";
import styled from "styled-components/macro";
import {
  StyledCard as Card,
  StyledCardContent as CardContent,
  StyledTypography as Typography,
  StyledIconHolder as IconHolder
} from "./StyledComp.js";

import { ArrowUp, ArrowDown, File, Download} from "react-feather";

const Chip = styled(MuiChip)`
  height: 20px;
  padding: 4px 0;
  font-size: 85%;
  background-color: ${(props) => props.theme.palette[props.color ? props.color : "primary"].light};
  color: ${(props) => props.theme.palette.common.white};
  margin-bottom: ${(props) => props.theme.spacing(4)};
`;

const COM = ({ onDownload, subject, name, site_name, upload, download, media_source, media_encoding, resolution, file_size }) => {
  return (<Card>
    <CardContent>
      <Typography gutterBottom variant="h5" component="h2">
        {subject}
      </Typography>
      <div>
        <Stack direction="row" spacing={1}>
          {media_source ? <Chip label={media_source} color="primary" /> : null}
          {resolution ? <Chip label={resolution} color="success" /> : null}
          {media_encoding ? <Chip label={media_encoding} color="info" /> : null}
        </Stack>
      </div>
      <Typography mb={4} color="textSecondary" component="p">
        [{site_name}]{name}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "flex-end" }}>
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
            {file_size / 1024} GB
          </Grid>
          <Grid item>
            <IconHolder>
              <File />
            </IconHolder>
          </Grid>
        </Grid>
        <Download onClick={onDownload} />
      </Box>
    </CardContent>
  </Card>);
};

export default COM;