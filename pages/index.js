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



    // const [preHtml, setPreHtml] = useState("")

    const [postArr, setPostArr] = useState([])


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

                        // onLocalSubmit={function (preHtml, { setDisableSubmit, clearState }) {


                        //     setDisableSubmit(false)
                        //     clearState()
                        //     setPostArr(pre => [{ keyId: Math.random(), preHtml }, ...pre])
                        // }}

                        onRemoteSubmit={function (toPreHtml, { editorState, theme, voteArr, voteTopic, pollDuration, voteId, imageObj, imageBlockNum, setDisableSubmit, clearState }) {


                            const promiseUploadArr = [];


                            const imageObjKeyArr = Object.keys(imageObj)

                            if (Array.isArray(imageObjKeyArr) && imageObjKeyArr.length > 0) {

                                const dataSnap = new FormData();
                                const dataImage = new FormData();
                                const promiseImgSnapArr = [];
                                const promiseImgUrlArr = [];

                                Object.keys(imageObj).forEach((objKey, index) => {
                                    imageObj[objKey].forEach(img => {

                                        promiseImgSnapArr.push(fetch(img.imgSnap)
                                            .then(res => {
                                                return res.blob()
                                            })
                                            .then(fileBlob => {
                                                dataSnap.append("file", new File([fileBlob], img.imgSnap.substr(img.imgSnap.lastIndexOf("/") + 1) + "-snap", { type: "image/jpeg" }))
                                            })
                                        )

                                        promiseImgUrlArr.push(fetch(img.imgUrl)
                                            .then(res => {
                                                return res.blob()
                                            })
                                            .then(fileBlob => {
                                                dataImage.append("file", new File([fileBlob], img.imgUrl.substr(img.imgUrl.lastIndexOf("/") + 1) + "-img", { type: "image/jpeg" }))
                                            })
                                        )


                                        // console.log(img.imgSnap.substr(img.imgSnap.lastIndexOf("/") + 1), img.imgSnap.substr(img.imgUrl.lastIndexOf("/") + 1))
                                    })

                                })

                                promiseUploadArr.push(Promise.allSettled(promiseImgSnapArr).then(arr => {

                                    return axios.post(`/api/picture/uploadPicture`, dataSnap, {
                                        headers: { 'content-type': 'multipart/form-data' },
                                    })

                                }))

                                promiseUploadArr.push(Promise.allSettled(promiseImgUrlArr).then(arr => {
                                    //console.log(data.getAll("file"))
                                    return axios.post(`/api/picture/uploadPicture2`, dataImage, {
                                        headers: { 'content-type': 'multipart/form-data' },
                                    })

                                }))
                            }





                            if (voteId) {
                                const { d, h, m } = pollDuration
                                const expireDate = new Date(Date.now() + (3600 * 24 * d + 3600 * h + 60 * m) * 1000)

                                promiseUploadArr.push(
                                    axios.post(`/api/voteBlock/createVote`, { voteId, voteTopic, voteArr, expireDate }, {
                                        //  headers: { 'content-type': 'multipart/form-data' },
                                    }).then(response => {
                                        console.log(response.data)
                                    })
                                )
                            }



                            Promise.allSettled(promiseUploadArr).then((arr) => {

                                if (Array.isArray(imageObjKeyArr) && imageObjKeyArr.length > 0) {
                                    Object.keys(imageObj).forEach((objKey, index) => {
                                        imageObj[objKey].forEach(img => {
                                            img.imgSnap = "/api/picture/downloadPicture/" + img.imgSnap.substr(img.imgSnap.lastIndexOf("/") + 1) + "-snap"
                                            img.imgUrl = "/api/picture/downloadPicture/" + img.imgUrl.substr(img.imgUrl.lastIndexOf("/") + 1) + "-img"
                                        })
                                    })
                                }
                                const preHtml = toPreHtml({ editorState, theme, voteArr, voteTopic, pollDuration, voteId, imageObj, imageBlockNum })

                                setDisableSubmit(false)
                                clearState()
                                setPostArr(pre => [{ keyId: Math.random(), preHtml }, ...pre])
                                // setPreHtml(preHtml)
                            })
                        }}

                    />
                </Grid>
            </Grid>
            <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Grid container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    spacing={0}
                    sx={{}}
                >
                    <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{}}>
                        {postArr.map((preHtml, index) => {

                            return (
                                <EditorViewer key={preHtml.keyId} preHtml={preHtml.preHtml}
                                    downloadImageUrl="/api/picture/downloadPicture/"
                                    downloadVoteUrl="/api/voteBlock/" />
                            )
                        })}
                    </Grid>

                </Grid>
            </Box>

        </Container>
    )

}



async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}