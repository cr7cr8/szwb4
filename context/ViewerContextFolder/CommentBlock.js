
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
    ChatBubbleOutline, Edit, DeleteOutline, OpenInFullOutlined, AspectRatioOutlined, Close
} from '@mui/icons-material';

export default function CommentBlock({ contentId, options,


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


    useEffect(function () {

        axios.get(`/api/commentBlock/getComment/${contentId}`).then(response => {


            setCommentArr(response.data)

        })

    }, [])

    return (

        <Box sx={{ "mb": commentArr.length === 0 ? "0px" : "1px" }}>
            {commentArr.map((comment) => {


                return (

                    <Box key={comment._id}>
                        {theme.isDark && <Divider />}
                        <Box sx={{ display: "flex", alignItems: "center" }}>
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
                        {parse(comment.content, options)}
                    </Box>

                )


            })}



            {(commentArr.length < commentNum) && < Button sx={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }} fullWidth
                onClick={function () {
                    axios.get(`/api/commentBlock/getComment/${contentId}/${String(commentArr.at(-1).postDate)}`).then(response => {


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