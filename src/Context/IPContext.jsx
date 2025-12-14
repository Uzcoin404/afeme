import { createContext, useState, useMemo } from "react";

const IPContext = createContext();

function Provider({children}) {

    const [IP, setIP] = useState(JSON.parse(window.localStorage.getItem('IP')) || "");
    const value = useMemo(() => ({ IP, setIP }), [IP]);

    return (
        <IPContext.Provider value={value}>{children}</IPContext.Provider>
    )
}
export { IPContext, Provider}