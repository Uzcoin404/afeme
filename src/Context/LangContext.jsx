import { createContext, useEffect, useState, useMemo } from "react";

const Context = createContext()

function Provider({children}) {

    const [lang, setLang] = useState(window.localStorage.getItem("lang") || "uz");

    useEffect(() => {
        window.localStorage.setItem("lang", lang)
    }, [lang])

    const value = useMemo(() => ({lang, setLang}), [lang]);

    return (
        <Context.Provider value={value}>{children}</Context.Provider>
    )
}
export { Context, Provider}