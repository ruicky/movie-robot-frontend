import styled from "styled-components/macro";
import { Breadcrumbs, Card, CardContent, CardMedia, Typography } from "@mui/material";
import { spacing } from "@mui/system";

export const StyledBreadcrumbs = styled(Breadcrumbs)(spacing);
export const StyledCard = styled(Card)(spacing);
export const StyledIconHolder = styled.span`
  display: flex;
  padding-right: ${(props) => props.theme.spacing(2)};
  svg {
    width: 14px;
    height: 14px;
  }
`;

export const StyledCardContent = styled(CardContent)`
  /* border-bottom: 1px solid ${(props) => props.theme.palette.grey[300]}; */
`;

export const StyledCardMedia = styled(CardMedia)`
  height: 220px;
`;

export const StyledTypography = styled(Typography)(spacing);