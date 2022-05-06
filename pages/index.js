import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'


import React, { useState, useContext, useEffect, useId } from "react"



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




import { EditorContextProvider as EditorCtx } from "../context/EditorContextProvider";

import parse, { domToReact, attributesToProps } from 'html-react-parser';
import reactDom from 'react-dom'


const options = {
    replace: (domNode) => {
        const { name, type, attribs, children } = domNode



        if (name === "object" && attribs["data-type"] === "image-block") {
            return <div>{children.map((item, index) => {
                return <img key={index} src={item.attribs["data-imgsnap"]} style={{ width: 100, height: 100 }} />
            })}</div>
        }
        else if (name === "object" && attribs["data-type"] === "vote-block") {

            // const voteArrHtml = voteArr.map((vote, index) => `<object data-item-${index}>${escape(vote)}</object>`)
            // const voteTopicHtml = `<object data-topic>${escape(voteTopic)}</object>`
            // const pollDurationHtml = `<object data-duration>${JSON.stringify(pollDuration).trim()}</object>`

           

            const topic = children?.[0]?.children?.[0]?.data ?? ""
            const duration = children?.[1]?.children?.[0]?.data

            const [{ }, { }, ...voteArr_] = children
            //console.log(topic, duration)

            const voteArr = voteArr_.map(item => {
                return item?.children?.[0]?.data??""
            })

            console.log(topic)
            console.log(duration)
            console.log(voteArr)



            return <span>{topic}</span>
            // console.log(topic,duration,voteArr)
            // console.log(children[0].children[0].data)
            // console.log(children[1].children[0].data)

        }



    }
}


export default function App() {

    const windowObj = (typeof window === "undefined") ? {} : window
    const myLoader = ({ src }) => { return src }


    const [savedEditorState, setSavedEditorState] = useState()
    const [savedImageObj, setSavedImageObj] = useState()
    const [savedVoteArr, setSavedVoteArr] = useState()
    const [savedVoteTopic, setSavedVoteTopic] = useState()
    const [savedPollDuration, setSavedPollDuration] = useState()

    // const random = String(Math.random())

    const random = useId()
    const random2 = useId()

    const [html, setHtml] = useState("")

    return (
        <Container disableGutters={true} fixed={false} maxWidth={windowObj?.innerWidth >= 3000 ? false : "lg"} sx={{}} >

            <Head>
                <title>Draft Page</title>
                <meta name="Dafter editor" content="Draf Editor" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            {/*  <h1>fff</h1>
            <h1>{random2}</h1>
            <h1>{useId()}</h1> */}

            <Grid container
                direction="row"
                justifyContent="space-around"
                alignItems="flex-start"
                spacing={0}
                sx={{}}
            >
                <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{}}>
                    <EditorCtx

                        {...{
                            savedEditorState, setSavedEditorState,
                            savedImageObj, setSavedImageObj,
                            savedVoteArr, setSavedVoteArr,
                            savedVoteTopic, setSavedVoteTopic,
                            savedPollDuration, setSavedPollDuration
                        }}
                        onSubmit={function (preHtml) {

                            console.log("--------------------")
                            //    console.log(preHtml)
                            setHtml(parse(preHtml, options))
                        }}

                    />
                </Grid>
            </Grid>
            <>{html}</>
        </Container>
    )

}