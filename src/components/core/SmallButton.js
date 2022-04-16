import styled from "styled-components/macro";
import {Button} from "@mui/material";

export const SmallButton = styled(Button)`
  padding: 4px;
  min-width: 0;

  svg {
    width: 0.9em;
    height: 0.9em;
  }
`;