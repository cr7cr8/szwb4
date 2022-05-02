import React, { useState, createContext } from "react"

export const Context = createContext()

export function ContextProvider({ children, ...props }) {

    const [count, setCount] = useState(0)

    return (

        <Context.Provider value={{
            count, setCount
        }}>
            {children}
        </Context.Provider>
    )
}