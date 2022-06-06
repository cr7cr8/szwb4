import '../styles/globals.css'
import React, { useContext } from "react"
import { context, AppContextProvider } from "../context/AppContextProvider"
import ThemeContextProvider from "../context/ThemeContextProvider"




function MyApp({ Component, pageProps }) {




  return (
    <ThemeContextProvider colorIndex={pageProps.colorIndex ?? 5} themeMode={pageProps.themeMode ?? "light"}>
      <AppContextProvider>
        <Component {...pageProps} />
      </AppContextProvider>
    </ThemeContextProvider>
  )
}

export default MyApp
