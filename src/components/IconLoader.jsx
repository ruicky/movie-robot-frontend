import React, { useState, useEffect } from 'react';
import { Icon, loadIcons } from '@iconify/react';


const strToIconify = (icon) => {
    // 转换图标格式：把驼峰命名转换成连字符命名
    return icon.replace(/([A-Z])/g, "-$1").toLowerCase().slice(1);
};

const IconLoader = ({ icon, className }) => {
    if (icon.includes(":")) {
        // 如果图标已经是 iconify 格式，直接渲染
        return <Icon icon={icon} className={className} />;
    }

    const [iconName, setIconName] = useState(null);
    const mounted = React.useRef(false);

    useEffect(() => {
        // 防止在组件卸载后仍然更新状态
        mounted.current = true;
        const iconifyIcon = strToIconify(icon);
        const iconSets = ["material-symbols", "mdi", "fe"];

        // 将所有可能的图标集和图标名称组合起来
        const iconsToLoad = iconSets.map(set => `${set}:${iconifyIcon}`);

        // 加载图标
        loadIcons(iconsToLoad,
            (_loaded, missing, _pending, _unsubscribe) => {
                const iconNames = iconsToLoad.filter(icon => !missing.find(_icon => `${_icon.prefix}:${_icon.name}` === icon));
                if (iconNames.length) {
                    // 如果找到图标，更新状态
                    mounted.current && setIconName(iconNames[0]);
                }
            });
        return () => {
            // 组件卸载后更新状态会报错
            mounted.current = false;
        };
    }, [icon]); // 当icon输入变化时重新运行这个效果

    // 如果找到图标则渲染
    return iconName ? <Icon icon={iconName} className={className} /> : null
};

export default IconLoader;
