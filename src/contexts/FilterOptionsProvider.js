import React, {createContext, useEffect, useState} from "react";
import {getFilterOptions} from "@/api/CommonApi";

const FilterOptionsContext = createContext(null);

function FilterOptionsProvider({children}) {
    const [filterOptions, setFilterOptions] = useState({})
    useEffect(async () => {
        const filterOptions = await getFilterOptions()
        setFilterOptions(filterOptions)
    }, [])
    return (
        <FilterOptionsContext.Provider value={filterOptions}>
            {children}
        </FilterOptionsContext.Provider>
    );
}

export {FilterOptionsContext, FilterOptionsProvider};