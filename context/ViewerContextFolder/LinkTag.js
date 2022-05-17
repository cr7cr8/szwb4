import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect, useContext, Component } from 'react';
import { Link, Box } from '@mui/material';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
export default function LinkTag({ linkAdd }) {

    const theme = useTheme()
    const colorObj = theme.colorObj
    const [content, setContent] = useState("")

    const cssObj = {
        color: theme.isLight ? colorObj[500] : colorObj[300],
        cursor: "pointer",
        textDecoration: "none",
        "&:hover": { textDecoration: "underline" },
        display: "inline",
    }

    const onClick = (e) => { setContent(linkAdd) }


    return (

        React.createElement(
            content ? Link : Box,
            { sx: cssObj, ...content ? { href: linkAdd, target: "_blank", rel: "noopener" } : { onClick } },
            content ? linkAdd : linkAdd.match(/(\/\/)([a-z0-9\-._~%]+)/)[2]
        )

    )
}