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

//import { TextBlock } from "../db/schema"
const { TextBlock } = require("../db/schema")

export async function getServerSideProps(context) {

    //console.log("===>>> req", context.req.dataObj)
    const { params, query } = context

    console.log(params, query)  // undefiend {ttt: 'hihissss}

    return TextBlock.find({}).sort({ postDate: -1 }).then(docs => {
        //console.log(docs[0])
        return {
            props: {
                contentArr: docs.map(doc => ({ _id: doc._id, content: doc.content, ownerName: doc.ownerName }))
            },
        }
    })
}



export default function App({ contentArr = [] }) {

    const windowObj = (typeof window === "undefined") ? {} : window
    const [postArr, setPostArr] = useState(contentArr)


    return (
        <Container disableGutters={true} fixed={false} maxWidth={windowObj?.innerWidth >= 3000 ? false : "lg"} sx={{}} >

            <Head>
                <title>Draft Page</title>
                <meta name="Dafter editor" content="Draf Editor" />
                <link rel="icon" href="/favicon.ico" />
            </Head>


            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Grid container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    spacing={0}
                    sx={{}}
                >
                    <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{}}>
                        {postArr.map((preHtmlObj, index) => {

                            return (
                                <EditorViewer
                                    key={preHtmlObj._id}
                                    preHtml={preHtmlObj.content}
                                    downloadImageUrl="/api/picture/downloadPicture/" // commentOut when local
                                    downloadVoteUrl="/api/voteBlock/" // commentOut when local

                                    avatarPeopleList={["UweF23", "TonyCerl", "大发发", "m大Gsd哈"]}
                                    downloadAvatarUrl={`https://picsum.photos/200`}
                                    genAvatarLink={function (downloadAvatarUrl, personName) {
                                        return downloadAvatarUrl// + personName
                                    }}

                                />
                            )
                        })}
                    </Grid>

                </Grid>
            </Box>

        </Container>
    )

}




