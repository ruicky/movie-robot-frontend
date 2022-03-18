import {Download, MovieFilter, Search} from "@mui/icons-material";
import {Star} from "react-feather";

const moviePages = [{
  href: "/movie/search", icon: Search, title: "搜索资源"
}, {
  href: "/download/record", icon: Download, title: "下载记录"
}];
const settingPages = [{
  href: "/site/dashboard", icon: Star, title: "站点设置"
}];

const navItems = [{
  title: "影音", pages: moviePages
}, {
  title: "设置", pages: settingPages
}];

export default navItems;
