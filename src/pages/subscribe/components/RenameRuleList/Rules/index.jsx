import {ReplaceTextRule} from "@/pages/subscribe/components/RenameRuleList/Rules/ReplaceTextRule";

export const RenameRuleTypes = [
    {
        name: '替换种子名称&标题',
        value: 'replaceTorrentName',
        filter: ReplaceTextRule()
    },{
        name: '替换下载后文件名',
        value: 'replaceFileName',
        filter: ReplaceTextRule()
    }
];