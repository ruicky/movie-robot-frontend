import { Download, Search } from "@mui/icons-material";

const moviePages = [{
  href: "/movie/search", icon: Search, title: "搜索资源"
}, {
  href: "/download/record", icon: Download, title: "下载记录"
}];
// const settingPages = [{
//   href: "/setting", icon: Settings, title: "设置", children: [{
//     href: "/download/record", title: "基本设置"
//   }, {
//     href: "/download/record", title: "PT站点"
//   }, {
//     href: "/download/record", title: "影音服务"
//   }, {
//     href: "/download/record", title: "下载工具"
//   }, {
//     href: "/download/record", title: "通知设置"
//   }, {
//     href: "/download/record", title: "媒体识别"
//   }]
// }];
// , {
//   title: "设置", pages: settingPages
// }
const navItems = [{
  title: "影音", pages: moviePages
}];

export default navItems;
