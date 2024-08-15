import { createContext, useState } from "react";

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
    const [ loggedUser, setLoggedUser ] = useState("")

    return (
        < AuthContext.Provider value={{ loggedUser, setLoggedUser }}>
            {children}
        </AuthContext.Provider >
    )
}
