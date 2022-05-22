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
        console.log(docs)
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

    const windowObj = (typeof window === "undefined") ? {} : window
    const myLoader = ({ src }) => { return src }


    const [isPending, startTransition] = useTransition()

    const [showEdit, setShowEdit] = useState(false)


    const [postArr, setPostArr] = useState(contentArr)
    const [avatarPeopleList, setAvatarPeopleList] = useState(avatarList?.length ? avatarList : [])
    const [showAvatarPanel, setShowAvatarPanel] = useState(false)

    const theme = useTheme()
    const breakpointColumnsObj = {
        default: 1,
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


            {/* <Dialog
                onBackdropClick={function () { }}
               // fullWidth={true}
                //  fullScreen={true}
                open={true}
                onClose={function () { }}
                scroll={"body"}
                sx={{}}
            > */}
            {showAvatarPanel && <ImageAdjuster userName={userName} avatarPeopleList={avatarPeopleList}
                setAvatarPeopleList={setAvatarPeopleList}
                setShowAvatarPanel={setShowAvatarPanel} />}
            {/* </Dialog> */}



            <Box sx={{ display: "flex", bgcolor: theme.colorBgObj, justifyContent: "space-around" }}>


                <Avatar
                    alt="Remy Sharp"
                    src={avatarPeopleList.includes(userName) ? "/api/avatar/downloadAvatar/" + userName : ""}
                    sx={{ width: 50, height: 50 }}

                    onClick={function () {
                        setShowAvatarPanel(true)
                    }}
                />

                {userName}
                <Button onClick={function () { setShowEdit(true) }}>Edit</Button>

            </Box>

            <Dialog
                onBackdropClick={function () {
                    //setOpen(false) 
                    setShowEdit(false)
                }}
                fullWidth={true}
                //  fullScreen={true}
                open={showEdit}
                onClose={function () { }}
                scroll={"paper"}



                sx={{
                    "& .MuiDialog-paper": {
                        width: "100%",
                        height: "auto",//bgcolor:"transparent",
                        boxShadow: 0, borderRadius: "4px",
                        overflowX: "hidden",
                        //   overflowY:"auto",
                        //   overflowY: "auto",
                    },

                    // "& > div > div": {
                    //     overflowX: "visible",
                    //     overflowY: "auto",
                    //     //  overflow: "hidden",
                    //     // paddingTop: "0px",

                    //     //px: "8px",
                    //     bgcolor: "pink",

                    //     // width: "100%",
                    //     // width: { xs: "95%", sm: "95%", md: "95%", lg: "95%", xl: "95%" },
                    //     // mx: 0,

                    // },

                }}
            >
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
                                    setPostArr(pre => [preHtmlObj, ...pre])
                                    setShowEdit(false)
                                    clearState()
                                })


                            }}
                        />

                    </Grid>
                </Grid>
            </Dialog>



            <Container disableGutters={true} fixed={false} maxWidth={windowObj?.innerWidth >= 3000 ? false : "lg"} sx={{}} >


                <Grid container
                    direction="row"
                    justifyContent="space-around"
                    alignItems="flex-start"
                    spacing={0}
                    sx={{}}
                >
                    <Grid item xs={10} sm={10} md={10} lg={10} xl={10} sx={{}}>


                        {/* <EditorCtx


                            // onChange={function (preHtmlObj) {
                            //     startTransition(function () {
                            //         // setPreHtml(preHtml)
                            //         setPostArr(pre => [preHtmlObj])
                            //     })
                            // }}
                            userName={userName}
                            peopleList={peopleList}
                            avatarPeopleList={["User380"]}
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

                        /> */}
                    </Grid>
                </Grid>




                <Divider sx={{ margin: "8px", opacity: 0 }} />



{/* 
                <Masonry
                    breakpointCols={breakpointColumnsObj}
                    className="my-masonry-grid"
                    columnClassName="my-masonry-grid_column"
                >
                    {postArr.map((preHtmlObj, index) => {

                        return (
                            <NoSsr key={preHtmlObj._id}>
                                <ViewerCtx

                                    userName={userName}
                                    ownerName={preHtmlObj.ownerName}
                                    preHtml={preHtmlObj.content}
                                    preHtmlId={preHtmlObj._id}
                                    postDate={Date.parse(preHtmlObj.postDate)}

                                    setPostArr={setPostArr}

                                    downloadImageUrl="/api/picture/downloadPicture/" // commentOut when local
                                    downloadVoteUrl="/api/voteBlock/" // commentOut when local

                                    peopleList={peopleList}
                                    avatarPeopleList={avatarPeopleList}
                                    downloadAvatarUrl={`/api/avatar/downloadAvatar/`}
                                    genAvatarLink={function (downloadAvatarUrl, personName) {
                                        return downloadAvatarUrl + personName
                                    }}

                                />
                            </NoSsr>
                        )
                    })}
                </Masonry> */}


                <Box sx={{ display: "flex", flexDirection: "column" }}>
                    <Grid container
                        direction="row"
                        justifyContent="space-around"
                        alignItems="flex-start"
                        spacing={0}
                        sx={{}}
                    >
                        <Grid item xs={12} sm={8} md={6} lg={6} xl={6} sx={{}}>
                            {postArr.map((preHtmlObj, index) => {

                                return (
                                    <NoSsr key={preHtmlObj._id}>
                                        <ViewerCtx

                                            userName={userName}
                                            ownerName={preHtmlObj.ownerName}
                                            preHtml={preHtmlObj.content}
                                            preHtmlId={preHtmlObj._id}
                                            postDate={Date.parse(preHtmlObj.postDate)}

                                            setPostArr={setPostArr}

                                            downloadImageUrl="/api/picture/downloadPicture/" // commentOut when local
                                            downloadVoteUrl="/api/voteBlock/" // commentOut when local

                                            peopleList={peopleList}
                                            avatarPeopleList={avatarPeopleList}
                                            downloadAvatarUrl={`/api/avatar/downloadAvatar/`}
                                            genAvatarLink={function (downloadAvatarUrl, personName) {
                                                return downloadAvatarUrl + personName
                                            }}

                                        />
                                    </NoSsr>
                                )
                            })}
                        </Grid>

                    </Grid>
                </Box>

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




function ImageAdjuster({ userName, avatarPeopleList, setAvatarPeopleList, setShowAvatarPanel }) {

    const [isPending, startTransition] = useTransition()
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const inputRef = useRef()

    // const avatarString = "data:image/svg+xml;base64," + btoa(multiavatar(userName))

    // const avatarString = `https://picsum.photos/200/500`

    const [avatarString, setAvatarString] = useState(avatarPeopleList.includes(userName)
        ? `/api/avatar/downloadAvatar/${userName}`
        : "data:image/svg+xml;base64," + btoa(multiavatar(userName)))

    function update(e) {
        e.stopPropagation()
        if (e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)) {

            const file = URL.createObjectURL(e.currentTarget.files[0])
            setAvatarString(file)
        }
    }

    return (

        <>

            <input ref={inputRef} type="file" multiple={false} accept="image/*" style={{ display: "none" }}
                onClick={function (e) { e.currentTarget.value = null; }}
                onChange={update}
            />

            <Box
                sx={{
                    width: "100vw", height: "100vh",
                    zIndex: 1000, overflow: "hidden",
                    position: "fixed", display: "flex",
                    justifyContent: "center", alignItems: "center",
                    bgcolor: "rgba( 0,0,0,0.5 )",
                    '& div[data-testid*="cropper"]': { borderRadius: "1000px" }
                }}

                onClick={function () {
                    setShowAvatarPanel(false)
                }}

            >
                <Box
                    onClick={function (e) {
                        e.stopPropagation()
                    }}


                    sx={{
                        width: 300, height: 300, position: "relative",// bgcolor: "lightgreen", borderRadius: "1000px" ,
                        // overflow:"hidden"
                    }}>
                    <Cropper image={avatarString}
                        aspect={1}
                        crop={crop}

                        //     style={{ height: "100%", width: "100%", display: "block" }}
                        rotation={rotation}
                        zoom={zoom}
                        onCropChange={setCrop}


                        onRotationChange={setRotation}
                        onCropComplete={onCropComplete}

                        onZoomChange={setZoom}

                    />


                    <IconButton sx={{
                        fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                        position: "absolute", top: 8, left: 8,
                        zIndex: 80,
                        bgcolor: "rgba(255,255,255,0.3)"
                    }}
                        size="small"
                        contentEditable={false} suppressContentEditableWarning={true}
                        onClick={async function (e) {

                            inputRef.current.click()

                        }}
                    >
                        <AccountCircleOutlined fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
                    </IconButton>


                    <IconButton sx={{
                        fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                        position: "absolute", top: 8, right: 8,
                        zIndex: 80,
                        bgcolor: "rgba(255,255,255,0.3)"
                    }}
                        size="small"
                        onClick={async function () {

                            if (!avatarString) return

                            const croppedImage = await getCroppedImg(
                                avatarString,
                                croppedAreaPixels,
                                rotation,
                            )

                            // setOpen(false)
                            setAvatarString(croppedImage)

                            setCrop({ x: 0, y: 0 })
                            setZoom(1)

                            fetch(croppedImage)
                                .then(file => {
                                    return file.blob()
                                })
                                .then(blobData => {

                                    const data = new FormData();

                                    data.append("file", new File([blobData], userName, { type: "image/jpeg" }))
                                    data.append('obj', JSON.stringify({ ownerName: userName }));

                                    return axios.post(`/api/avatar/uploadAvatar/${userName}`, data, {
                                        headers: { 'content-type': 'multipart/form-data' },
                                    }).then(response => {
                                        console.log(response.data)
                                        if (!avatarPeopleList.includes(userName)) {
                                            setAvatarPeopleList(pre => ([...pre, userName]))
                                        
                                        }
                                        setShowAvatarPanel(false)
                                        location.reload(); 
                                    })
                                })
                        }}
                    >
                        <Crop fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
                    </IconButton >




                    <Slider
                        size="medium"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        aria-labelledby="Zoom"
                        //  classes={{ root: classes.slider }}
                        onChange={(e, zoom) => setZoom(zoom)}
                        sx={{
                            //  padding: '22px 0px',
                            //  marginLeft: "",
                            marginLeft: "20px",
                            marginRight: "20px",
                            position: "absolute",
                            bottom: 10,
                            left: 0,
                            right: 0,
                            my: "0",
                            width: "85%",
                            mx: "auto",
                            color: "skyblue",

                        }}
                    />


                </Box>


            </Box>

        </>
    )

}






