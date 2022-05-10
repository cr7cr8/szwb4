import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect, useContext, Component } from 'react';
import { ThemeProvider, useTheme, createTheme, experimental_sx as sx } from '@mui/material/styles';

import { Button, CssBaseline, Switch, Typography } from '@mui/material';


import { red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey } from '@mui/material/colors';

const colorArr = [red, pink, purple, deepPurple, indigo, blue, lightBlue, cyan, teal, green, lightGreen, lime, yellow, amber, orange, deepOrange, brown, grey, blueGrey]


function useColorObj(colorIndex = 5) {

    const [colorObj, setColorIndex] = useState(colorArr[colorIndex])

    function setColorObj(index) {
        setColorIndex(colorArr[index])
    }

    return [colorObj, setColorObj]

}


export default function ThemeContextProvider({ cssBaseLine = true, ...props }) {


    const [sizeObj, setSizeObj] = useState(props.sizeObj || { xs: "1.5rem", sm: "1.5rem", md: "1.5rem", lg: "1.5rem", xl: "1.5rem" })
    const [colorObj, setColorObj] = useColorObj(2)

 

    const scaleSizeObj = useCallback((factor = 1) => {
        const obj = {}
        Object.keys(sizeObj).forEach(itemKey => {

            const num = Number(sizeObj[itemKey].replace(/[^\d\.]/g, '')) * factor
            const unit = String(sizeObj[itemKey].replace(/[\d\.]/g, ''))
            obj[itemKey] = num + unit

        })

        return obj
    }, [sizeObj])


    const addingSizeObj = useCallback((numOfPix = 0) => {
        const obj = {}
        Object.keys(sizeObj).forEach(itemKey => {

            //  const num = Number(sizeObj[itemKey].replace(/[^\d\.]/g, '')) * factor
            //  const unit = String(sizeObj[itemKey].replace(/[\d\.]/g, ''))
            obj[itemKey] = `calc(${sizeObj[itemKey]} ${numOfPix >= 0 ? "+" : "-"} ${Math.abs(numOfPix)}px)`

        })

        return obj
    }, [sizeObj])


    const [mode, setMode] = React.useState(props.mode || 'light');



    const myTheme = React.useMemo(
        () =>
            createTheme({

                typography: {
                    button: {
                        textTransform: 'none'
                    }
                },

                palette: {
                    mode,
                    panelColor: mode === "light" ? "lightgray" : "darkgray",
                    mentionBg: mode === "light" ? "aliceblue" : "skyblue",
                },
                sizeObj,
                setSizeObj,

                colorArr,
                colorObj, setColorObj,


                setMode,
                scaleSizeObj,
                addingSizeObj,
                mode,
                isLight: mode === "light",
                isDark: mode === "dark",

                components: {

                    MuiButton: {
                        defaultProps: {
                            variant: "contained",
                            disableRipple: false,
                        },

                    },
                    MuiPaper: {
                        defaultProps: {

                        },
                        styleOverrides: {
                            root: ({ ownerState, theme, ...props }) => {

                                return [
                                    //  ownerState.variant === 'body2' &&
                                    sx({
                                        fontSize: theme.sizeObj,
                                    }),

                                ]
                            }
                        }
                    },
                    MuiTypography: {
                        styleOverrides: {
                            root: ({ ownerState, theme, ...props }) => {

                                return [
                                    ownerState.variant === 'body2' &&
                                    sx({
                                        fontSize: theme.sizeObj,

                                    }),

                                ]
                            }
                        }

                    },

                    MuiSvgIcon: {
                        styleOverrides: {
                            root: ({ ownerState, theme, ...props }) => {

                                return [
                                    //  ownerState.variant === 'body2' &&
                                    sx({
                                        color: theme.palette.text.secondary,
                                    }),

                                ]
                            }
                        }
                    }
                }
            }),
        [mode, sizeObj,colorObj],
    );

    return (

        <ThemeProvider theme={myTheme}>
            {cssBaseLine && <CssBaseline />}
            {props.children}
        </ThemeProvider>


    )


}