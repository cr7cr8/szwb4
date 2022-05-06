import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import React, { useState, useContext, useEffect, useId, useTransition } from "react"



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




import { EditorContextProvider as EditorCtx, EditorViewer } from "../context/EditorContextProvider";

import parse, { domToReact, attributesToProps } from 'html-react-parser';



export default function App() {

    const windowObj = (typeof window === "undefined") ? {} : window
    const myLoader = ({ src }) => { return src }


    const [isPending, startTransition] = useTransition()



    const [preHtml, setPreHtml] = useState("")

    return (
        <Container disableGutters={true} fixed={false} maxWidth={windowObj?.innerWidth >= 3000 ? false : "lg"} sx={{}} >

            <Head>
                <title>Draft Page</title>
                <meta name="Dafter editor" content="Draf Editor" />
                <link rel="icon" href="/favicon.ico" />
            </Head>



            <Grid container
                direction="row"
                justifyContent="space-around"
                alignItems="flex-start"
                spacing={0}
                sx={{}}
            >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{}}>
                    <EditorCtx


                        // onChange={function (preHtml) {
                        //     startTransition(function () {
                        //         setPreHtml(preHtml)
                        //     })

                        // }}

                        onLocalSubmit={function (preHtml) {

                            setPreHtml(preHtml)

                        }}

                        onRemoteSubmit={function (toPreHtml, { editorState, theme, voteArr, voteTopic, pollDuration, imageObj, imageBlockNum, }) {


                            //console.log(imageObj)

                            Object.keys(imageObj).forEach(objKey => {
                                imageObj[objKey].forEach(img => {
                                 //   console.log(img.imgSnap, img.imgUrl)

                                    console.log(img.imgSnap.substr(img.imgSnap.lastIndexOf("/")+1),
                                        img.imgSnap.substr(img.imgUrl.lastIndexOf("/")+1))

                                })

                            })

                        }}



                    />
                </Grid>
            </Grid>
            <EditorViewer preHtml={preHtml} />
        </Container>
    )

}