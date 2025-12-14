import { createContext, useEffect, useState, useMemo } from "react";

const UpdateUserContext = createContext()

function Provider({children}) {

    const [updateUser, setUpdateUser] = useState(0);
    const value = useMemo(() => ({updateUser, setUpdateUser}), [updateUser]);

    return (
        <UpdateUserContext.Provider value={value}>{children}</UpdateUserContext.Provider>
    )
}
export { UpdateUserContext, Provider}