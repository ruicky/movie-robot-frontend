import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";

import App from "./App";

import { QueryProvider } from './contexts/QueryProvider';
import { ThemeProvider } from "./contexts/ThemeContext";
import { AppInfoProvider } from "@/contexts/AppSetting";

if ("paintWorklet" in CSS) {
    CSS.paintWorklet.addModule(
        "https://www.unpkg.com/css-houdini-squircle@0.1.3/squircle.min.js"
    );
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