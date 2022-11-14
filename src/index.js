import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import squircle from "css-houdini-squircle/squircle.min.js?url";
import App from "./App";

import { QueryProvider } from './contexts/QueryProvider';
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppInfoProvider } from "@/contexts/AppSetting";

if ("paintWorklet" in CSS) {
    CSS.paintWorklet.addModule(squircle);
}

ReactDOM.render(
    <BrowserRouter>
        <QueryProvider>
            <ThemeProvider>
                <AppInfoProvider>
                    <App />
                </AppInfoProvider>
            </ThemeProvider>
        </QueryProvider>
    </BrowserRouter>,
    document.getElementById("root")
);