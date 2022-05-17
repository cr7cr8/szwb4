import React, { useState, createContext, useMemo, useId, useDeferredValue, useCallback } from "react"

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

import { NoSsr } from '@mui/base';

import DraftEditor from "./EditorContextFolder/DraftEditor"
import parse, { domToReact, attributesToProps, Element } from 'html-react-parser';
import reactElementToJSXString from 'react-element-to-jsx-string';

import ImageViewerBlock from "./ViewerContextFolder/ImageViewerBlock";
import VoteViewerBlock from "./ViewerContextFolder/VoteViewerBlock";
import AvatarChip from "./ViewerContextFolder/AvatarChip";
import LinkTag from "./ViewerContextFolder/LinkTag";
import PostTimeRender from "./ViewerContextFolder/PostTimeRender";

import Countdown from "react-countdown";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Button, Switch, Box, Hidden, Collapse, Typography, Divider } from '@mui/material';

import { Close } from "@mui/icons-material";
import axios from "axios";

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
                        bgcolor: theme.isLight ? theme.palette.background.default : "transparent",
                        //  bgcolor: theme.isLight?theme.palette.background.default:colorObj[500],
                        fontSize: theme.sizeObj,
                        ...attribs["text-align"] && { textAlign: attribs["text-align"] },

                        //    "& .MuiChip-root.MuiChip-filled": { fontSize: theme.sizeObj }
                    }}>
                        {domToReact(children, options)}
                    </Box>
                )
            }
            else if (name === "div" && attribs["small-font"]) {
                return (
                    <Box sx={{
                        bgcolor: theme.isLight ? theme.palette.background.default : "transparent",
                        //   bgcolor: theme.isLight?theme.palette.background.default:colorBgObj,
                        fontSize: theme.scaleSizeObj(0.8),
                        ...attribs["text-align"] && { textAlign: attribs["text-align"] },

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

    return (

        <ViewerContext.Provider value={{}}>
            <Box sx={(theme) => {
                return {
                    bgcolor: theme.colorBgObj,
                    marginTop: "32px", marginBottom: "32px",
                    borderRadius: "4px",
                    boxShadow: 5,
                    overflow: "hidden"

                }
            }}>

                <Box sx={{ display: "flex", px: "4px", py: "2px", alignItems: "center", justifyContent: "flex-start", "& .MuiBox-root": { fontSize: theme.sizeObj } }}>

                    <AvatarChip
                        bgTrans={true}
                        personName={ownerName}
                        downloadAvatarUrl={downloadAvatarUrl}
                        avatarPeopleList={avatarPeopleList}
                        genAvatarLink={genAvatarLink}
                    >
                        <span>{ownerName}</span>
                    </AvatarChip>
                    &nbsp;&nbsp;
                    <NoSsr>
                        <Countdown date={new Date(postDate)} intervalDelay={1 * 1000}
                            renderer={function ({ days, hours, minutes, seconds, completed, ...props }) {
                                return <PostTimeRender  {...{ days, hours, minutes, seconds, completed, ...props }} />
                            }}
                            overtime={true}
                        />
                    </NoSsr>
                    &nbsp;&nbsp;
                    <IconButton size="small" sx={{ marginLeft: "auto" }} onClick={function () {
                        axios.delete(`/api/textBlock/deleteText/${preHtmlId}`)
                        setPostArr(pre => pre.filter(preHtmlObj => preHtmlObj._id !== preHtmlId))
                    }}><Close fontSize="medium" /></IconButton>
                </Box>
                {parse(preHtml, options)}
                <Box sx={{ display: "flex", px: "4px", py: "0px", alignItems: "center", justifyContent: "flex-start", "& .MuiBox-root": { fontSize: theme.sizeObj } }}>
                    FF
                </Box>
            </Box>
        </ViewerContext.Provider>
    )


}

function extractText(dom) {
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



// function PostTimeRender({ days, hours, minutes, seconds, completed, ...props }) {

//     const theme = useTheme()



//     const message = completed

//         ? days > 0
//             ? `${days}d`
//             : hours > 0
//                 ? `${hours}h`
//                 : minutes > 0
//                     ? `${minutes}m`
//                     : `0m`//`${seconds}s`//`Just now` //`${seconds} sec ago`
//         : days > 0
//             ? `Remaining ${days}+ days`
//             : hours > 0
//                 ? `Remaining ${hours}+ hours`
//                 : minutes > 0
//                     ? `Remaining ${minutes}+ minutes`
//                     : `Remaining ${seconds} seconds`

//     return <Typography className="count-down" style={{ fontSize: "1rem" }} sx={{ color: theme.palette.text.secondary }}>{message} </Typography>

// }