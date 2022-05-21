import React, { useState, createContext, useMemo, useId, useDeferredValue, useCallback, memo, useEffect } from "react"

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

import { NoSsr } from '@mui/base';

import parse, { domToReact, attributesToProps, Element } from 'html-react-parser';


import ImageViewerBlock from "./ViewerContextFolder/ImageViewerBlock";
import VoteViewerBlock from "./ViewerContextFolder/VoteViewerBlock";
import AvatarChip from "./ViewerContextFolder/AvatarChip";
import LinkTag from "./ViewerContextFolder/LinkTag";
import PostTimeRender from "./ViewerContextFolder/PostTimeRender";
import CommentBlock from "./ViewerContextFolder/CommentBlock";

import Countdown from "react-countdown";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import {
    Container, Grid, Paper, IconButton, ButtonGroup,

    Stack, Button, Switch, Box, Hidden, Collapse, Typography, Divider, Chip, Avatar
} from '@mui/material';

import {
    EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined,
    ChatBubbleOutline, Edit, DeleteOutline, OpenInFullOutlined, AspectRatioOutlined, Close
} from '@mui/icons-material';

import axios from "axios";



import { EditorContextProvider as EditorCtx, SimpleContextProvider as SimpleEtx } from "../context/EditorContextProvider";
export const ViewerContext = createContext()

export function ViewerContextProvider({
    userName,
    preHtmlId,
    ownerName,
    postDate,
    preHtml,
    setPostArr,
    peopleList = [], avatarPeopleList = [], genAvatarLink = () => { },
    downloadImageUrl = "", downloadVoteUrl = "", downloadAvatarUrl = ""
}) {

    const theme = useTheme()
    const colorObj = theme.colorObj
    const colorBgObj = theme.colorBgObj

    const options = useMemo(() => ({
        replace: (domNode) => {
            const { name, type, attribs, children } = domNode

            if (name === "object" && attribs["data-type"] === "image-block") {

                let imgSnapArr = []
                let imgUrlArr = []

                children.forEach((item, index) => {
                    if (downloadImageUrl) {
                        imgSnapArr.push(downloadImageUrl + item.attribs["data-imgsnap"].substr(item.attribs["data-imgsnap"].lastIndexOf("/") + 1) + "-snap")
                        imgUrlArr.push(downloadImageUrl + item.attribs["data-imgurl"].substr(item.attribs["data-imgurl"].lastIndexOf("/") + 1) + "-img")
                    }
                    else {
                        imgSnapArr.push(item.attribs["data-imgsnap"])
                        imgUrlArr.push(item.attribs["data-imgurl"])
                    }
                })



                //     Object.keys(imageObj).forEach((objKey, index) => {
                //         imageObj[objKey].forEach(img => {
                //             img.imgSnap = "/api/picture/downloadPicture/" + img.imgSnap.substr(img.imgSnap.lastIndexOf("/") + 1) + "-snap"
                //             img.imgUrl = "/api/picture/downloadPicture/" + img.imgUrl.substr(img.imgUrl.lastIndexOf("/") + 1) + "-img"
                //         })
                //     })





                return <ImageViewerBlock {...{ imgSnapArr, imgUrlArr }} />
            }
            else if (name === "object" && attribs["data-type"] === "vote-block") {

                const voteId = attribs["date-vote_id"]

                const expireDate = attribs["date-expire_date"]

                const topic = children?.[0]?.children?.[0]?.data ?? ""
                const duration = children?.[1]?.children?.[0]?.data
                const voteArr = children.slice(2).map(item => {
                    return item?.children?.[0]?.data ?? ""
                })

                return <VoteViewerBlock {...{ topic, duration, voteArr, expireDate, voteId, downloadVoteUrl, userName }} />
            }
            else if (name === "object" && attribs["data-type"] === "person-tag") {
                //only children and domNode are dom
                //children[0] children[1] ... are NOT


                return (
                    <AvatarChip
                        personName={extractText(children)}
                        downloadAvatarUrl={downloadAvatarUrl}
                        avatarPeopleList={avatarPeopleList}
                        genAvatarLink={genAvatarLink}
                    >
                        {domToReact(children)}
                    </AvatarChip>
                )
            }

            if (name === "div" && !attribs["small-font"]) {

                return (
                    <Box sx={{
                        bgcolor: "transparent",
                        //  bgcolor: theme.isLight ? theme.palette.background.default : "transparent",
                        //  bgcolor: theme.isLight?theme.palette.background.default:colorObj[500],
                        fontSize: theme.sizeObj,
                        ...attribs["text-align"] && { textAlign: attribs["text-align"] },
                        "px": "4px",
                        //    "& .MuiChip-root.MuiChip-filled": { fontSize: theme.sizeObj }
                    }}>
                        {domToReact(children, options)}
                    </Box>
                )
            }
            else if (name === "div" && attribs["small-font"]) {
                return (
                    <Box sx={{
                        bgcolor: "transparent",
                        //    bgcolor: theme.isLight ? theme.palette.background.default : "transparent",
                        //   bgcolor: theme.isLight?theme.palette.background.default:colorBgObj,
                        fontSize: theme.scaleSizeObj(0.8),
                        ...attribs["text-align"] && { textAlign: attribs["text-align"] },
                        "px": "4px",
                        //   "& .MuiChip-root.MuiChip-filled": { fontSize: theme.scaleSizeObj(0.8), }

                    }}>{domToReact(children, options)}</Box>
                )
            }
            if (name === "span" && attribs["data-type"] === "link") {
                const linkAdd = extractText(children)
                return (
                    <LinkTag {...{ linkAdd }} />
                )
            }


        }
    })/*, [preHtml, theme, userName]*/)


    const extractText = (dom) => {
        let text = ""
        const option = {
            replace: (domNode) => {
                const { name, type, attribs, children } = domNode
                if (type === "text") {

                    text = text + domNode.data
                }


            }
        }
        domToReact(dom, option)


        return text
    }


    const [commentArr, setCommentArr] = useState([])
    const [showComment, setShowComment] = useState(false)
    const [showEdit, setShowEdit] = useState(false)

    const [commentNum, setCommentNum] = useState(0)


    useEffect(function () {
        axios.get(`/api/commentBlock/countComment/${preHtmlId}`).then(response => {

            setCommentNum(response.data)
        })

    }, [])


    return (

        <ViewerContext.Provider value={{}}>
            <Box sx={(theme) => {
                return {
                    bgcolor: theme.colorBgObj,
                    //   marginTop: "32px", marginBottom: "32px",
                    borderRadius: "4px",
                    boxShadow: 1,
                    //   overflow: "hidden",
                    marginBottom: "8px",
                }
            }}>

                <Box sx={{
                    display: "flex", px: "0px", py: "2px", alignItems: "center", justifyContent: "flex-start",
                    //  "& .MuiBox-root": { fontSize: theme.sizeObj }

                }}>

                    <AvatarChip
                        bgTrans={true}
                        personName={ownerName}
                        downloadAvatarUrl={downloadAvatarUrl}
                        avatarPeopleList={avatarPeopleList}
                        genAvatarLink={genAvatarLink}
                        iconOn={true}
                    >
                        <span>{ownerName}</span>
                    </AvatarChip>



                    <NoSsr>
                        <Countdown date={new Date(postDate)} intervalDelay={1 * 1000}
                            renderer={function ({ days, hours, minutes, seconds, completed, ...props }) {
                                return <PostTimeRender  {...{ days, hours, minutes, seconds, completed, ...props }} />
                            }}
                            overtime={true}
                        />
                    </NoSsr>

                    <IconButton size="small" sx={{ marginLeft: "auto" }} onClick={function () {
                        axios.delete(`/api/textBlock/deleteText/${preHtmlId}`)
                        setPostArr(pre => pre.filter(preHtmlObj => preHtmlObj._id !== preHtmlId))
                    }}>
                        <Close fontSize="medium" />

                    </IconButton>
                </Box>
                {parse(preHtml, options)}

                <Box sx={{ display: "flex", px: "0px", py: "0px", alignItems: "center", justifyContent: "space-between", "& .MuiBox-root": { fontSize: theme.sizeObj } }}>



                    <Button fullWidth variant="clear"
                        onClick={function () {
                            setShowComment(pre => !pre)
                        }}
                        sx={{ bgcolor: "transparent", borderTopLeftRadius: 0, borderTopRightRadius: 0, "&:hover": { bgcolor: theme.colorBgObj } }}>
                        <ChatBubbleOutline fontSize="small" sx={{ color: theme.palette.text.secondary }} /><Typography sx={{ color: theme.palette.text.secondary }}>{commentNum}</Typography>
                    </Button>
                    <Button fullWidth variant="clear"
                        onClick={function () {
                            setShowEdit(pre => !pre)
                        }}
                        sx={{ bgcolor: "transparent", borderTopLeftRadius: 0, borderTopRightRadius: 0, "&:hover": { bgcolor: theme.colorBgObj } }}>
                        <Edit fontSize="small" sx={{ color: theme.palette.text.secondary }} />
                    </Button>

                </Box>
                {/* {(showComment) && (!showEdit) && <Divider />} */}
                <Collapse in={showEdit} unmountOnExit={true}>
                    <SimpleEtx
                        contentId={preHtmlId}
                        key={preHtmlId}
                        peopleList={peopleList}
                        avatarPeopleList={avatarPeopleList}
                        genAvatarLink={genAvatarLink}
                        downloadAvatarUrl={downloadAvatarUrl}
                        userName={userName}
                        onSubmit={function (newComment) {

                            axios.post(`/api/commentBlock/createComment`, {
                                ...newComment,

                            }).then(response => {

                                //   console.log(response.data)

                            })
                            //    newComment.postDate = String(newComment.postDate)
                            setShowEdit(false)
                            setShowComment(true)
                            setCommentArr(pre => [newComment, ...pre])
                            setCommentNum(pre => pre + 1)
                        }}
                    />
                </Collapse>
                <Collapse in={showComment} unmountOnExit={false}>
                    <CommentBlock
                        userName={userName}
                        contentId={preHtmlId} options={options} extractText={extractText}
                        peopleList={peopleList}
                        avatarPeopleList={avatarPeopleList}
                        genAvatarLink={genAvatarLink}
                        downloadAvatarUrl={downloadAvatarUrl}
                        commentArr={commentArr}
                        setCommentArr={setCommentArr}
                        commentNum={commentNum}
                        setCommentNum={setCommentNum}
                    />
                </Collapse>







            </Box>
        </ViewerContext.Provider>
    )


}