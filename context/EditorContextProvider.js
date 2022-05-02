import React, { useState, createContext } from "react"

export const EditorContext = createContext()

export function EditorContextProvider({ children, ...props }) {

    const [count, setCount] = useState(0)

    return (

        <EditorContext.Provider value={{
            count, setCount
        }}>
            {children}
        </EditorContext.Provider>
    )
}