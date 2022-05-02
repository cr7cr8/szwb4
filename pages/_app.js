import '../styles/globals.css'
import React, { useContext } from "react"
import { context, ContextProvider } from "../ContextProvider"
import ThemeContextProvider from "../ThemeContextProvider"


function MyApp({ Component, pageProps }) {

  //console.log(Component)

  return (
    <ThemeContextProvider >
      <ContextProvider>
        <Component {...pageProps} />
      </ContextProvider>
    </ThemeContextProvider>
  )
}

export default MyApp
