import { createContext, useEffect, useState, useMemo } from "react";
import { getCookie, setCookie } from "../Utils/cookies";

const DefaultCurrency = "usd";
const CurrencyContext = createContext();

function Provider({children}) {

    const [currency, setCurrency] = useState(getCookie('currency') || DefaultCurrency);

    useEffect(() => {
        setCookie('currency', currency, 5);
    }, [currency])

    const value = useMemo(() => ({currency, setCurrency}), [currency]);

    return (
        <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
    )
}
export { CurrencyContext, Provider}