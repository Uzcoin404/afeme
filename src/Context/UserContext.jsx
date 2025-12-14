import { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";

import { UpdateUserContext } from "./UpdateUserContext";
const UserContext = createContext();

let url = process.env.REACT_APP_URL;

function Provider({ children }) {

    const [user, setUser] = useState([]);
    const { updateUser, setUpdateUser } = useContext(UpdateUserContext);
    const token = localStorage.getItem("Token");
    const userID = localStorage.getItem("user_id");

    const requestOptions = useMemo(() => ({
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
        redirect: 'follow'
    }), [token]);

    const successData = useCallback((newData) => {
        const data = {
            data: newData,
            status: true,
            favorites: newData.favorites.length
        };
        localStorage.setItem('user_id', newData.id);
        setUser(data);
    }, []);

    const setErrorData = useCallback(() => {
        setUser({ status: false });
    }, []);

    useEffect(() => {
        if (token) {
            fetch(`${url}getuser`, requestOptions)
                .then(response => response.text())
                .then((response) => {
                    try {
                        const parsed = JSON.parse(response);
                        const status = parsed.status;
                        const newData = parsed.data;
                        if (status === true && newData.hasOwnProperty("id")) {
                            successData(newData);
                        } else {
                            setErrorData();
                        }
                    } catch (e) {
                        setErrorData();
                    }
                })
                .catch(() => {
                    setErrorData();
                });
        } else {
            setErrorData();
        }
    }, [updateUser, token, requestOptions, successData, setErrorData])

    const value = useMemo(() => ({ user, setUser }), [user]);

    return (
        <UserContext.Provider value={value}>{children}</UserContext.Provider>
    )
}
export { UserContext, Provider }