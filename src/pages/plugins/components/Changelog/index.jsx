import React from "react";
import styled from "styled-components/macro";

import {Box, Chip as MuiChip, Divider as MuiDivider, Typography as MuiTypography,} from "@mui/material";

import {spacing} from "@mui/system";

const Chip = styled(MuiChip)`
  height: 20px;
  margin-top: -3px;
  font-weight: bold;
  font-size: 75%;
  background-color: rgb(71, 130, 218)
`;

const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Changelog() {
    return (
        <>
            <Typography variant="h5" gutterBottom>
                更新日志
            </Typography>
            <Box mt={3}>
                <Typography variant="subtitle1">
                    <Chip color="secondary" label="v3.2.1"/> – Dec 19, 2021
                    <ul>
                        <li>Fix prettier issues</li>
                        <li>Upgrade to MUI v5.2.4</li>
                        <li>Upgrade dependencies to latest versions</li>
                    </ul>
                </Typography>
                <Divider my={6}/>
            </Box>
        </>
    );
}

export default Changelog;
