import React from "react";
import async from "./components/Async";
import DashboardLayout from "./layouts/Dashboard";
import AuthGuard from "./components/guards/AuthGuard";
import AuthLayout from "./layouts/Auth";

// Auth components
import SignIn from "./pages/auth/SignIn";
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";
import InitWeb from "./pages/config/init/InitWeb";
import InitMediaServer from "./pages/config/init/InitMediaServer";
import InitDownloadClient from "./pages/config/init/InitDownloadClient";
import InitMediaPath from "./pages/config/init/InitMediaPath";
import SiteDashboard from "./pages/site";

const MovieAnalyze = async(() => import("./pages/movie/analyze"));
const MovieSearch = async(() => import("./pages/movie/search"));
const DownloadRecord = async(() => import("./pages/download/record"));
const routes = [{
    path: "auth", element: <AuthLayout/>, children: [{
        path: "sign-in", element: <SignIn/>
    }, {
        path: "404", element: <Page404/>
    }, {
        path: "500", element: <Page500/>
    }]
}, {
    path: "setup", element: <AuthLayout/>, children: [{
        path: "web", element: <InitWeb/>
    }, {
        path: "media-server", element: <InitMediaServer/>
    }, {
        path: "download-client", element: <InitDownloadClient/>
    }, {
        path: "media-path", element: <InitMediaPath/>
    }]
}, {
    path: "/", element: (<AuthGuard>
        <DashboardLayout/>
    </AuthGuard>), children: [{
        path: "", element: <DownloadRecord/>
    }]
}, {
    path: "movie", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "default", element: <MovieAnalyze/>
    }, {
        path: "analyze", element: <MovieAnalyze/>
    }, {
        path: "search", element: <MovieSearch/>
    }]
}, {
    path: "download", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "default", element: <DownloadRecord/>
    }, {
        path: "record", element: <DownloadRecord/>
    }]
}, {
    path: "site", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "dashboard", element: <SiteDashboard/>
    }]
}, {
    path: "*",
    element: <AuthLayout/>,
    children: [
        {
            path: "*",
            element: <Page404/>
        }
    ]
}];

export default routes;
