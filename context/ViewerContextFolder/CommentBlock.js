
import React, { createContext, useEffect, useState, useReducer, useRef, useMemo, useCallback, useLayoutEffect, useContext, Component } from 'react';
import {
    Container, Grid, Paper, IconButton, ButtonGroup,

    Stack, Button, Switch, Box, Hidden, Collapse, Typography, Divider, Chip, Avatar
} from '@mui/material';

import axios from "axios";
import parse, { domToReact, attributesToProps, Element } from 'html-react-parser';
import AvatarChip from "./AvatarChip";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';

import Countdown from "react-countdown";
import PostTimeRender from "./PostTimeRender";

import {
    EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined,
    ChatBubbleOutline, Edit, DeleteOutline, OpenInFullOutlined, AspectRatioOutlined, Close, Reply
} from '@mui/icons-material';


import { EditorContextProvider as EditorCtx, SimpleContextProvider as SimpleEtx } from "../EditorContextProvider";

export default function CommentBlock({ contentId, options,

    userName,
    peopleList,
    avatarPeopleList,
    genAvatarLink,
    downloadAvatarUrl,
    commentArr,
    setCommentArr,
    commentNum,
    setCommentNum,
    ...props }) {

    const theme = useTheme()

    const [disableButton, setDisableButton] = useState(false)


    useEffect(function () {

        axios.get(`/api/commentBlock/getComment/${contentId}`).then(response => {


            setCommentArr(response.data)

        })

    }, [])

    return (

        <Box sx={{ "mb": commentArr.length === 0 ? "0px" : "1px" }}>
            {commentArr.map((comment) => {

                return (

                    <Comment
                        key={comment._id}
                        userName={userName}
                        comment={comment}
                        options={options}
                        downloadAvatarUrl={downloadAvatarUrl}
                        avatarPeopleList={avatarPeopleList}
                        genAvatarLink={genAvatarLink}
                        setCommentArr={setCommentArr}
                        setCommentNum={setCommentNum}
                    />
                    // <Box key={comment._id}>
                    //     {parse(comment.content, options)}
                    // </Box>

                )


            })}



            {(commentArr.length < commentNum) && < Button sx={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }} fullWidth
                disabled={disableButton}

                onClick={function () {
                    setDisableButton(true)
                    axios.get(`/api/commentBlock/getComment/${contentId}/${String(commentArr.at(-1).postDate)}`).then(response => {

                        setDisableButton(false)
                        setCommentArr(pre => [...pre, ...response.data])

                    })

                    //  console.log(String(commentArr.at(-1).postDate))
                }}


            >
                {commentArr.length + "/" + commentNum}
            </Button>
            }
        </Box >
    )


}


function Comment({ comment, userName, options, downloadAvatarUrl, avatarPeopleList, genAvatarLink, setCommentArr, setCommentNum }) {

    const theme = useTheme()

    const [showEdit, setShowEdit] = useState(false)
    const [showSubComment, setShowSubComment] = useState(false)
    const [subCommentArr, setSubCommentArr] = useState([])

    const [subCommentNum, setSubCommentNum] = useState(0)

    const [disableButton, setDisableButton] = useState(false)

    useEffect(function () {

        axios.get(`/api/subCommentBlock/getSubComment/${comment._id}`).then(response => {

            console.log(response.data)
            setSubCommentArr(response.data)

        })


        axios.get(`/api/subCommentBlock/countSubComment/${comment._id}`).then(response => {

            setSubCommentNum(response.data)
        })




    }, [])



    return (
        <>
            <Box key={comment._id} >
                <Divider />
                <Box sx={{ display: "flex", alignItems: "center", "py": "2px" }}>
                    <AvatarChip
                        bgTrans={true}
                        personName={comment.ownerName}
                        downloadAvatarUrl={downloadAvatarUrl}
                        avatarPeopleList={avatarPeopleList}
                        genAvatarLink={genAvatarLink}
                        iconOn={true}
                    >
                        <span>{comment.ownerName}</span>
                    </AvatarChip>


                    <Countdown date={new Date(comment.postDate)} intervalDelay={1 * 1000}
                        renderer={function ({ days, hours, minutes, seconds, completed, ...props }) {
                            return <PostTimeRender  {...{ days, hours, minutes, seconds, completed, ...props }} />
                        }}
                        overtime={true}
                    />





                    <IconButton size="small" sx={{ marginLeft: "auto" }} onClick={function () {
                        axios.delete(`/api/commentBlock/deleteComment/${comment._id}`)
                        setCommentArr(pre => {

                            return pre.filter((item) => (item._id !== comment._id))

                        })
                        setCommentNum(pre => pre - 1)

                    }}><Close fontSize="medium" /></IconButton>

                </Box>



                <Box sx={{ display: "flex", alignItems: "center", paddingBottom: "4px" }}>
                    {parse(comment.content, options)}
                </Box>


                <Box sx={{ display: "flex", px: "0px", py: "0px", alignItems: "center", justifyContent: "space-between", "& .MuiBox-root": { fontSize: theme.sizeObj } }}>

                    <Button fullWidth variant='clear' sx={{ bgcolor: "transparent" }}
                        onClick={function () {
                            setShowSubComment(pre => !pre)

                        }}

                    ><ChatBubbleOutline fontSize="medium" />{subCommentNum}</Button>
                    <Button fullWidth variant='clear' sx={{ bgcolor: "transparent" }}
                        onClick={function () {
                            setShowEdit(pre => !pre)

                        }}
                    ><Reply fontSize="medium" /></Button>
                </Box>


                <Collapse in={showEdit} unmountOnExit={true}>
                    <Box sx={{}}>
                        <SimpleEtx
                            contentId={comment._id}

                            peopleList={["Ada", "分为二分", "Bob", "Cat", "Frank", "就能收到", "的我发dsd"]}
                            avatarPeopleList={["Bob"]}
                            genAvatarLink={genAvatarLink}
                            downloadAvatarUrl={downloadAvatarUrl}
                            userName={userName}
                            onSubmit={function (newComment) {

                                newComment.commentId = newComment.contentId.replace("content", "subComment")
                                newComment._id = newComment._id.replace("comment", "subComment")
                                delete newComment.contentId

                                axios.post(`/api/subCommentBlock/createSubComment`, newComment)
                                setShowEdit(false)
                                setSubCommentArr(pre => [newComment, ...pre])
                                setShowSubComment(true)
                                setSubCommentNum(pre => pre + 1)
                            }}
                        />
                    </Box>
                </Collapse>

                {
                    subCommentArr.map(subComment => {

                        return (


                            <Collapse in={showSubComment} unmountOnExit={false}>
                                <Box key={subComment._id} sx={{ bgcolor: theme.isLight ? theme.colorObj[100] : theme.colorObj[900] }}>
                                    <Divider />
                                    <Box sx={{ display: "flex", alignItems: "center", "py": "2px" }}>
                                        <AvatarChip
                                            bgTrans={true}
                                            personName={subComment.ownerName}
                                            downloadAvatarUrl={downloadAvatarUrl}
                                            avatarPeopleList={avatarPeopleList}
                                            genAvatarLink={genAvatarLink}
                                            iconOn={true}
                                        >
                                            <span>{subComment.ownerName}</span>
                                        </AvatarChip>


                                        <Countdown date={new Date(subComment.postDate)} intervalDelay={1 * 1000}
                                            renderer={function ({ days, hours, minutes, seconds, completed, ...props }) {
                                                return <PostTimeRender  {...{ days, hours, minutes, seconds, completed, ...props }} />
                                            }}
                                            overtime={true}
                                        />


                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", "px": "4px", paddingBottom: "4px" }}>
                                        {parse(subComment.content, options)}
                                    </Box>
                                </Box>
                            </Collapse>
                        )



                    })

                }

                {(subCommentArr.length < subCommentNum) && showSubComment && < Button

                    disabled={disableButton}
                    sx={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }} fullWidth
                    onClick={function () {
                        setDisableButton(true)
                        axios.get(`/api/subCommentBlock/getSubComment/${comment._id}/${String(subCommentArr.at(-1).postDate)}`).then(response => {

                            setDisableButton(false)
                            setSubCommentArr(pre => [...pre, ...response.data])

                        })


                    }}


                >
                    {subCommentArr.length + "/" + subCommentNum}
                </Button>
                }


            </Box>


        </>
    )

}