import React from "react";
import async from "./components/Async";
import AuthGuard from "./components/guards/AuthGuard";
import AuthLayout from "./layouts/Auth";

// Auth components
import SignIn from "./pages/auth/SignIn";
import Page404 from "./pages/auth/Page404";
import Page500 from "./pages/auth/Page500";

const DashboardLayout = async(() => import("./layouts/Dashboard"));
const MovieAnalyze = async(() => import("./pages/movie/analyze"));
const MovieSearch = async(() => import("./pages/movie/search"));
const DownloadRecord = async(() => import("./pages/download/record"));
const SiteDashboard = async(() => import("./pages/site"));
const InitMediaServer = async(() => import("./pages/config/MediaServer"));
const InitDownloadClient = async(() => import("./pages/config/DownloadClient"));
const InitMediaPath = async(() => import("./pages/config/MediaPath"));
const InitMovieMetadata = async(() => import("./pages/config/MovieMetadata"));
const InitWeb = async(() => import("./pages/config/Web"));
const InitAdminUser = async(() => import("./pages/config/AdminUser"));
const DoubanConfig = async(() => import("./pages/config/DoubanConfig"));
const NotifyConfig = async(() => import("./pages/config/NotifyConfig"));
const Notify = async(() => import("./pages/notify/index"));
const FreeDownloadConfig = async(() => import("./pages/config/FreeDownload"));
const UserManager = async(() => import("./pages/user/Index"));
const EditUser = async(() => import("./pages/user/EditUser"));
const SubscribeRankingList = async(() => import("./pages/subscribe/rankingList"));
const SubscribeList = async(() => import("./pages/subscribe/list"));
const SubscribeSearch = async(() => import("./pages/subscribe/search"));
const ScoreRuleConfig = async(() => import("./pages/config/ScoreRuleConfig"));

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
        path: "admin", element: <InitAdminUser/>
    }, {
        path: "web", element: <InitWeb/>
    }, {
        path: "media-server", element: <AuthGuard><InitMediaServer/></AuthGuard>
    }, {
        path: "download-client", element: <AuthGuard><InitDownloadClient/></AuthGuard>
    }, {
        path: "media-path", element: <AuthGuard><InitMediaPath/></AuthGuard>
    }, {
        path: "movie-metadata", element: <AuthGuard><InitMovieMetadata/></AuthGuard>
    }]
}, {
    path: "config", element: <AuthGuard>
        <DashboardLayout/>
    </AuthGuard>, children: [{
        path: "web", element: <InitWeb/>
    }, {
        path: "media-server", element: <InitMediaServer/>
    }, {
        path: "download-client", element: <InitDownloadClient/>
    }, {
        path: "media-path", element: <InitMediaPath/>
    }, {
        path: "movie-metadata", element: <InitMovieMetadata/>
    }, {
        path: "notify", element: <NotifyConfig/>
    }, {
        path: "free-download", element: <FreeDownloadConfig/>
    }, {
        path: "score-config", element: <ScoreRuleConfig/>
    }]
}, {
    path: "smartDownload", element: <AuthGuard>
        <DashboardLayout/>
    </AuthGuard>, children: [{
        path: "douban", element: <DoubanConfig/>
    }]
}, {
    path: "/", element: (<AuthGuard>
        <DashboardLayout/>
    </AuthGuard>), children: [{
        path: "", element: <SubscribeRankingList/>
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
    path: "notify", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "list", element: <Notify/>
    }]
}, {
    path: "user", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "index", element: <UserManager/>
    }, {
        path: "edit", element: <EditUser/>
    }]
}, {
    path: "subscribe", element: (<AuthGuard><DashboardLayout/></AuthGuard>), children: [{
        path: "rankingList", element: <SubscribeRankingList/>
    }, {
        path: "search", element: <SubscribeSearch/>
    }, {
        path: "list", element: <SubscribeList/>
    }]
}, {
    path: "*", element: <AuthLayout/>, children: [{
        path: "*", element: <Page404/>
    }]
}];

export default routes;
