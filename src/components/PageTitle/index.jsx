import React from 'react';
import { Typography, Divider } from "@mui/material";

const PageTitle = ({
  children,
  text
}) => {
  return (
    <React.Fragment>
      <Typography variant="h3" gutterBottom>
        {text}
        {children}
      </Typography>
      <Divider my={4}/>
    </React.Fragment>
  );
};

export default PageTitle;
