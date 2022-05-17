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
    Slider, TextField, AppBar, Toolbar
} from '@mui/material';
import { EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined, Menu } from '@mui/icons-material';
import myImageSrc from "../public/vercel.svg";

import { EditorContextProvider as EditorCtx } from "../context/EditorContextProvider";
import { ViewerContextProvider as ViewerCtx } from "../context/ViewerContextProvider";


import parse, { domToReact, attributesToProps } from 'html-react-parser';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { getCookie, getCookies, setCookies } from 'cookies-next';



import Masonry from 'react-masonry-css';

///////////////////////////////////////import { TextBlock } from "../db/schema"
const { TextBlock, User } = require("../db/schema");
const signer = require('cookie-signature');




function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

function checkingCookie(req, res, next) {
    req.isCookieValid = null
    const cookie = getCookie("signedCookieObj", { req, res })
    //console.log("hasCookie", cookie ? true : false)

    if (cookie) {
        const checkedCookie = signer.unsign(cookie, 'this-is-a-cookieSecretKey')



        if (checkedCookie) {
            req.userName = JSON.parse(checkedCookie).userName

            User.findOne({ userName: req.userName }).then(doc => {
                if (doc) {
                    next(doc?.colorIndex
                        ? { themeMode: doc.themeMode, colorIndex: doc.colorIndex }
                        : { themeMode: "light", colorIndex: 5 }
                    )
                }
                else {
                    next({ themeMode: "light", colorIndex: 5 })
                }
            })
        }
        else {

            req.userName = false
            next({ themeMode: "light", colorIndex: 5 })
        }


    }
    else {
        const userName = "User" + Number(Math.random() * 1000).toFixed(0)
        setCookies('signedCookieObj', { userName }, { req, res, maxAge: 3600 * 24 * 365, httpOnly: true, sameSite: "lax" });
        const newCookie = getCookie("signedCookieObj", { req, res })
        const newSignedCookie = signer.sign(newCookie, 'this-is-a-cookieSecretKey')
        setCookies('signedCookieObj', newSignedCookie, { req, res, maxAge: 3600 * 24 * 365, httpOnly: true, sameSite: "lax" });
        console.log("new Signed Cookie", newSignedCookie)
        User.create({ userName })

        req.userName = userName
        next({ themeMode: "light", colorIndex: 5 })
    }


}



export async function getServerSideProps(context) {

    // return { props: {userName: "guest", contentArr: []}}

    const { params, query, req, res, ...props } = context
    const { themeMode, colorIndex } = await runMiddleware(req, res, checkingCookie)

    return TextBlock.find({}).sort({ postDate: -1 }).limit(35).then(docs => {

        return {
            ...(!req.userName) && {
                redirect: {
                    destination: '/auth-page',
                    permanent: false,
                }
            },
            props: {
                userName: req?.userName || "guest",
                colorIndex: colorIndex ?? 5,
                themeMode: themeMode ?? "light",
                contentArr: docs.map(doc => {
                    //  console.log(doc.postDate)
                    return { _id: doc._id, content: doc.content, ownerName: doc.ownerName, postDate: String(doc.postDate) }
                })
            }


        }
    })
}



export default function App({ userName, contentArr = [] }) {

    const windowObj = (typeof window === "undefined") ? {} : window
    const myLoader = ({ src }) => { return src }


    const [isPending, startTransition] = useTransition()

    const [postArr, setPostArr] = useState(contentArr)

    const theme = useTheme()
    const breakpointColumnsObj = {
        [theme.breakpoints.values.xs]: 1,
        [theme.breakpoints.values.sm]: 1,
        [theme.breakpoints.values.md]: 2,
        [theme.breakpoints.values.lg]: 3,
        [theme.breakpoints.values.xl]: 4,
        2000: 4, 3000: 5, 4000: 6, 5000: 7, 6000: 8, 7000: 9, 9999999: 10,
    };



    return (
        <>
            <Head>
                <title>Draft Page</title>
                <meta name="Dafter editor" content="Draf Editor" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Box sx={{ bgcolor: theme.colorBgObj }}>{userName}</Box>
            <Container disableGutters={true} fixed={false} maxWidth={windowObj?.innerWidth >= 3000 ? false : "lg"} sx={{}} >
                <Grid container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    spacing={0}
                    sx={{}}
                >
                    <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{}}>
                        <EditorCtx


                            // onChange={function (preHtmlObj) {
                            //     startTransition(function () {
                            //         // setPreHtml(preHtml)
                            //         setPostArr(pre => [preHtmlObj])
                            //     })
                            // }}
                            userName={userName}
                            peopleList={["UweF23", "UweF22", "TonyCerl", "JimWil", "大发发", "Jimberg", "m大Gsd哈"]}
                            avatarPeopleList={["UweF23", "TonyCerl", "大发发", "m大Gsd哈"]}
                            downloadAvatarUrl={`https://picsum.photos/200`}
                            genAvatarLink={function (downloadAvatarUrl, personName) {
                                return downloadAvatarUrl// + personName
                            }}

                            onSubmit={function (preHtmlObj, { editorState, theme, voteArr, voteTopic, pollDuration, voteId, imageObj, imageBlockNum, setDisableSubmit, clearState }) {

                                //    console.log(preHtmlObj)
                                const promiseArr = [
                                    ...uploadPreHtml(preHtmlObj),  // commentOut when local
                                    ...uploadImage(imageObj), // commentOut when local
                                    ...uploadVote({ voteArr, voteTopic, pollDuration, voteId, postId: preHtmlObj._id }) // commentOut when local
                                ]

                                Promise.allSettled(promiseArr).then((arr) => {
                                    setDisableSubmit(false)
                                    clearState()
                                    setPostArr(pre => [preHtmlObj, ...pre])
                                })
                            }}

                        />
                    </Grid>
                </Grid>

                <Divider sx={{ margin: "8px", opacity: 0 }} />
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {postArr.map((preHtmlObj, index) => {

                        return (
                            <ViewerCtx
                                key={preHtmlObj._id}
                                userName={userName}
                                ownerName={preHtmlObj.ownerName}
                                preHtml={preHtmlObj.content}
                                preHtmlId={preHtmlObj._id}
                                postDate={Date.parse(preHtmlObj.postDate)}

                                setPostArr={setPostArr}

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
                </Masonry>


                {/* <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                                    <ViewerCtx
                                        key={preHtmlObj._id}
                                        userName={userName}
                                        ownerName={preHtmlObj.ownerName}
                                        preHtml={preHtmlObj.content}
                                        preHtmlId={preHtmlObj._id}
                                        postDate={Date.parse(preHtmlObj.postDate)}

                                        setPostArr={setPostArr}

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
                </Box> */}

            </Container>
        </>
    )

}


function uploadPreHtml(preHtmlObj) {

    const promiseUploadArr = []



    if (preHtmlObj.content) {

        promiseUploadArr.push(
            axios.post(`/api/textBlock/createText`, {
                ...preHtmlObj
            }, {
                //  headers: { 'content-type': 'multipart/form-data' },
            }).then(response => {
                console.log(response.data)
            })
        )

    }
    return promiseUploadArr
}

function uploadImage(imageObj) {

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


    return promiseUploadArr

}

function uploadVote({ voteArr, voteTopic, pollDuration, voteId, postId }) {
    const promiseUploadArr = []

    if (voteId) {
        const { d, h, m } = pollDuration
        const expireDate = new Date(Date.now() + (3600 * 24 * d + 3600 * h + 60 * m) * 1000)

        promiseUploadArr.push(
            axios.post(`/api/voteBlock/createVote`, { voteId, voteTopic, voteArr, expireDate, postId }, {
                //  headers: { 'content-type': 'multipart/form-data' },
            }).then(response => {
                console.log(response.data)
            })
        )
    }


    return promiseUploadArr


}