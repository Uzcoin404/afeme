import { createContext, useState, useMemo } from "react";

const SearchContext = createContext();

function Provider({children}) {

    const [searchTerms, setSearchTerms] = useState();
    const value = useMemo(() => ({searchTerms, setSearchTerms}), [searchTerms]);

    return (
        <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
    )
}
export { SearchContext, Provider}