import React from 'react';
import { Box } from "@mui/material";
import { ExpandLess as ExpandLessIcon, ExpandMore as ExpandMoreIcon } from "@mui/icons-material";

const OpenExtend = ({openText="展开",closeText="收起",onClick, sx}) => {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(!open)
    onClick && onClick(!open)
  }
  return (
    <Box
      sx={{display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'text.disabled', ...sx}}
      onClick={handleClick}
    >
      {open ? closeText : openText}
      {
        open
          ? <ExpandLessIcon sx={{width: '15px'}}/>
          : <ExpandMoreIcon sx={{width: '15px'}}/>
      }
    </Box>
  );
}

export default OpenExtend;