import React from "react";
import styled from "styled-components/macro";

import {Box, Chip as MuiChip, Divider as MuiDivider, Typography as MuiTypography,} from "@mui/material";

import {spacing} from "@mui/system";
import {ChangeLogItem} from "@/pages/plugins/components/Changelog/Item";



const Divider = styled(MuiDivider)(spacing);

const Typography = styled(MuiTypography)(spacing);

function Changelog({items}) {
    return (
        <>
            <Typography variant="h5" gutterBottom>
                更新日志
            </Typography>
            <Box mt={3}>
                {items && items.map((item, index) => (
                    <div key={index}>
                        <ChangeLogItem version={item.version} publishDate={item.date} body={item.body}/>
                        {index + 1 < items.length && <Divider my={6}/>}
                    </div>
                ))}

            </Box>
        </>
    );
}

export default Changelog;
