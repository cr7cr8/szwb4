import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'




import React, { useState, useContext, useEffect, useId, useTransition, memo, useCallback, useRef } from "react"


import { NoSsr } from '@mui/base';
import { Context, ContextProvider } from "../context/AppContextProvider"

import Link from "next/link"
import axios from "axios"
import Router, { useRouter } from 'next/router';


import {
    Container, Grid, Paper, IconButton, ButtonGroup, Stack, Box, Button, Chip, Avatar, CssBaseline, Typography, Collapse, Switch, Divider,
    Slider, TextField, AppBar, Toolbar, Dialog
} from '@mui/material';
import { EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined, Menu } from '@mui/icons-material';
import myImageSrc from "../public/vercel.svg";

import { EditorContextProvider as EditorCtx } from "../context/EditorContextProvider";
import { ViewerContextProvider as ViewerCtx } from "../context/ViewerContextProvider";



import parse, { domToReact, attributesToProps } from 'html-react-parser';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { getCookie, getCookies, setCookies } from 'cookies-next';


import Cropper from 'react-easy-crop';
import getCroppedImg from '../context/EditorContextFolder/cropImage';

import { Crop, DoneRounded, Close, AddCircleOutline, AddAPhoto, AccountCircleOutlined } from '@mui/icons-material';
import Masonry from 'react-masonry-css';
import multiavatar from '@multiavatar/multiavatar';
///////////////////////////////////////import { TextBlock } from "../db/schema"
const { TextBlock, User } = require("../db/schema");
const signer = require('cookie-signature');
const dbConnect = require("../db/dbConnect")



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

function getPeopleList(req, res, next) {

    return User.find({}).then(docs => {

        next(docs.map(item => item.userName))

    })


}

function getAvatarList(req, res, next) {

    return User.find({ hasAvatar: true }).then(docs => {

        next(docs.map(item => item.userName))

    })


}

function getTextBlock(req, res, next) {

    return TextBlock.find({}).sort({ postDate: -1 }).limit(123).then(docs => {

        const contentArr = docs.map(doc => {
            //  console.log(doc.postDate)
            return { _id: doc._id, content: doc.content, ownerName: doc.ownerName, postDate: String(doc.postDate) }
        })

        next(contentArr)
    })

}

export async function getServerSideProps(context) {
    await dbConnect["default"]()




    const { params, query, req, res, ...props } = context

    const { themeMode, colorIndex } = await runMiddleware(req, res, checkingCookie)
    const peopleList = await runMiddleware(req, res, getPeopleList)
    const avatarList = await runMiddleware(req, res, getAvatarList)
    const contentArr = await runMiddleware(req, res, getTextBlock)

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
            contentArr,
            peopleList,
            avatarList,
        }


    }

}



export default function App({ userName, contentArr = [], peopleList, avatarList }) {

    const [avatarPeopleList, setAvatarPeopleList] = useState(avatarList?.length ? avatarList : [])

    const theme = useTheme()

    const router = useRouter()

    return (
        <>
            <Head>
                <title>Edit Page</title>
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

                        // onChange={function (preHtmlObj) {
                        //     startTransition(function () {
                        //         // setPreHtml(preHtml)
                        //         setPostArr(pre => [preHtmlObj])
                        //     })
                        // }}
                        userName={userName}
                        peopleList={peopleList}
                        avatarPeopleList={avatarPeopleList}
                        downloadAvatarUrl={`/api/avatar/downloadAvatar/`}
                        genAvatarLink={function (downloadAvatarUrl, personName) {
                            return downloadAvatarUrl + personName
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
                                router.replace("/")
                            })


                        }}
                    />

                </Grid>
            </Grid>


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








