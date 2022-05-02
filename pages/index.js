import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import React, { useContext, useEffect } from "react"



import { Context, ContextProvider } from "../context/AppContextProvider"

import Link from "next/link"
import axios from "axios"
import Router, { useRouter } from 'next/router';




import {
    Container, Grid, Paper, IconButton, ButtonGroup, Stack, Box, Button, Chip, Avatar, CssBaseline, Typography, Collapse, Switch, Divider,
    Slider, TextField
} from '@mui/material';
import { EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined } from '@mui/icons-material';


import myImageSrc from "../public/vercel.svg";

export default function App() {

    let windowObj = (typeof window === "undefined") ? {} : window
    const myLoader = ({ src }) => {
        // return `${API}/user/photo/${blog.postedBy.username}`;
        return src
    }
    console.log(windowObj)
    return (
        <Container disableGutters={true} fixed={false} maxWidth={windowObj?.innerWidth >= 3000 ? false : "lg"}
        >
            <CssBaseline />

            <EmojiEmotions />
            FDFSFdddssewedwdwq
       r
        </Container>
    )

}