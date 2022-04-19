import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { QueryProvider } from './contexts/QueryProvider';
import { ThemeProvider } from "./contexts/ThemeContext";

ReactDOM.render(
  <BrowserRouter>
    <QueryProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryProvider>
  </BrowserRouter>,
  document.getElementById("root")
);