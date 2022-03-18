import React, { useEffect, useState } from "react";
import {Snackbar, Alert} from "@mui/material";

import message from "@/utils/message";

const GlobalSnackbars = () => {
  const [open, setOpen] = useState(false);
  const [severity, setSeverity] = useState("info");
  const [content, setContent] = useState("");

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    message.info = (msg) => {
      setOpen(true);
      setSeverity("info");
      setContent(msg);
    };
    message.warn = (msg) => {
      setOpen(true);
      setSeverity("warn");
      setContent(msg);
    };
    message.success = (msg) => {
      setOpen(true);
      setSeverity("success");
      setContent(msg);
    };
    message.error = (msg) => {
      setOpen(true);
      setSeverity("error");
      setContent(msg);
    };
  }, []);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={5000}
        onClose={handleClose}
      >
        <Alert variant={"filled"} onClose={handleClose} severity={severity}>
          {content}
        </Alert>
      </Snackbar>
    </>
  );
};

export default GlobalSnackbars;
