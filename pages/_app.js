import '../styles/globals.css'
import React, { useContext } from "react"
import { context, AppContextProvider } from "../context/AppContextProvider"
import ThemeContextProvider from "../context/ThemeContextProvider"




function MyApp({ Component, pageProps }) {

  //console.log(pageProps)

  return (
    <ThemeContextProvider >
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </ThemeContextProvider>
  )
}

export default MyApp
