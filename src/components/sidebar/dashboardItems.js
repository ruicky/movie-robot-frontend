import {Download, MovieFilter, Search} from "@mui/icons-material";
import {Settings, Star} from "react-feather";

const moviePages = [{
  href: "/movie/search", icon: Search, title: "搜索资源"
}, {
  href: "/download/record", icon: Download, title: "下载记录"
}];
const settingPages = [{
  href: "/site/dashboard", icon: Star, title: "站点管理"
},{
  href:"/config",icon: Settings, title: "基础设置",children:[
    {
      href: "/config/web",
      title: "访问设置",
    },
    {
      href: "/config/media-server",
      title: "媒体服务器",
    },
    {
      href: "/config/download-client",
      title: "下载工具",
    },
    {
      href: "/config/media-path",
      title: "存储路径",
    },
    {
      href: "/config/movie-metadata",
      title: "媒体元数据",
    }
  ]
}];

const navItems = [{
  title: "影音", pages: moviePages
}, {
  title: "设置", pages: settingPages
}];

export default navItems;
