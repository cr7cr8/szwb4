import React, { useState, createContext } from "react"

export const AppContext = createContext()

export function AppContextProvider({ children, ...props }) {

    //const [count, setCount] = useState(0)

    const [voteRecordingArr, setVoteRecordingArr] = useState([])

    return (

        <AppContext.Provider value={{
            //count, setCount,
            voteRecordingArr, setVoteRecordingArr
        }}>
            {children}
        </AppContext.Provider>
    )
}