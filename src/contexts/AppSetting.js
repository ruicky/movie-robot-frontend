import {createContext, useEffect, useState} from "react";
import {getAppInfo, getFilterOptions} from "@/api/CommonApi";

const AppInfoContext = createContext(null);

function AppInfoProvider({children}) {
    const [appInfo, setAppInfo] = useState({version: 'version', menus: []})
    useEffect(async () => {
        const appInfo = await getAppInfo()
        if (appInfo) {
            setAppInfo(appInfo)
        }
    }, [])
    return (
        <AppInfoContext.Provider value={appInfo}>
            {children}
        </AppInfoContext.Provider>
    );
}

export {AppInfoContext, AppInfoProvider};