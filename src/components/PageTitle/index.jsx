import React from 'react';
import { Typography, Divider, Box } from "@mui/material";

const PageTitle = ({
  children,
  text
}) => {
  return (
    <React.Fragment>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <Typography variant="h3" gutterBottom>
          {text}
        </Typography>
        {children}
      </Box>
      <Divider my={4}/>
    </React.Fragment>
  );
};

export default PageTitle;
