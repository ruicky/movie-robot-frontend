import {TorrentNameFilter} from "@/components/TorrentFilter/Filters/TorrentNameFIlter";
import {FileSizeFilter} from "@/components/TorrentFilter/Filters/FileSizeFilter";
import {MediaStreamFilter} from "@/components/TorrentFilter/Filters/MediaStreamFilter";
import {TorrentSeedersFilter} from "@/components/TorrentFilter/Filters/TorrentSeedersFilter";
import {SubtitleFilter} from "@/components/TorrentFilter/Filters/SubtitleFilter";
import {FreeDownloadFilter} from "@/components/TorrentFilter/Filters/FreeDownloadFilter";
import {HRFilter} from "@/components/TorrentFilter/Filters/HRFilter";
import {ReleaseTeamFilter} from "@/components/TorrentFilter/Filters/ReleaseTeamFilter";
import {SiteIdFilter} from "@/components/TorrentFilter/Filters/SiteIdFilter";
import {CateLevel1} from "@/components/TorrentFilter/Filters/CateLevel1Filter";
import {PublishDateFilter} from "@/components/TorrentFilter/Filters/PublishDateFilter";

export const FilterTypes = [
    {
        name: '过滤种子名称&标题',
        value: 'torrentName',
        filter: TorrentNameFilter()
    }, {
        name: '过滤下载后文件尺寸',
        value: 'fileSize',
        filter: FileSizeFilter()
    }, {
        name: '过滤媒体文件品质',
        value: 'mediaStream',
        filter: MediaStreamFilter()
    }, {
        name: '过滤种子做种人数',
        value: 'torrentSeeders',
        filter: TorrentSeedersFilter()
    }, {
        name: '过滤字幕',
        value: 'subtitle',
        filter: SubtitleFilter()
    }, {
        name: '过滤不计下载量',
        value: 'freeDownload',
        filter: FreeDownloadFilter()
    }, {
        name: '过滤不要求H&R考核',
        value: 'torrentHR',
        filter: HRFilter()
    }, {
        name: '过滤制作组',
        value: 'releaseTeam',
        filter: ReleaseTeamFilter()
    }, {
        name: '过滤站点',
        value: 'siteId',
        filter: SiteIdFilter()
    }, {
        name: '过滤种子所属分类',
        value: 'cateLevel1',
        filter: CateLevel1()
    }, {
        name: '过滤种子发布时间',
        value: 'publishDate',
        filter: PublishDateFilter()
    }
];