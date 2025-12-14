import { createContext, useEffect, useState, useMemo } from "react";
import UserContext from "./UserContext";

const UserInfo = createContext();

function Provider({ children }) {

    const [user, setUser] = useState([]);
    const value = useMemo(() => ({ user, setUser }), [user]);

    useEffect(() => {
        if (user.hasOwnProperty('data')) {
            // Mark that user data is available
        }
    }, [user])

    return (
        <UserInfo.Provider value={value}>{children}</UserInfo.Provider>
    )
}
export { UserContext, Provider }