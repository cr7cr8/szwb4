import React, { useState, createContext, useMemo, useId, useDeferredValue, useCallback } from "react"

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

import DraftEditor from "./EditorContextFolder/DraftEditor"
import parse, { domToReact, attributesToProps, Element } from 'html-react-parser';
import reactElementToJSXString from 'react-element-to-jsx-string';

import ImageViewerBlock from "./EditorViewerFolder/ImageViewerBlock";
import VoteViewerBlock from "./EditorViewerFolder/VoteViewerBlock";
import AvatarChip from "./EditorViewerFolder/AvatarChip";
import LinkTag from "./EditorViewerFolder/LinkTag";


import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Button, Switch, Box, Hidden, Collapse } from '@mui/material';


export const EditorContext = createContext()

export function EditorContextProvider({

    downloadAvatarUrl = "",
    genAvatarLink = () => { },

    onChange,
    onSubmit,

    ...props
}) {

    const key1 = useId().replace(":", "").replace(":", "")
    const rawJsText = useMemo(() => {

        return {
            "entityMap": {},
            "blocks": [
                {
                    "key": key1,
                    "text": "",
                    "type": "unstyled",
                    "depth": 0,
                    "inlineStyleRanges": [],
                    "entityRanges": [],
                    "data": {}
                },
                // {
                //     "key": "2222",
                //     "text": "",
                //     "type": "imageBlock",
                //     "depth": 0,
                //     "inlineStyleRanges": [],
                //     "entityRanges": [],
                //     "data": {}
                // }
            ]
        }
    }, []);


    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(rawJsText)) || EditorState.createEmpty())

    const [currentBlockKey, setCurrentBlockKey] = useState("ddd")

    const [imageObj, setImageObj] = useState({})
    const imageBlockNum = editorState.getCurrentContent().getBlocksAsArray().filter(block => block.getType() === "imageBlock").length

    // const [peopleList, setPeopleList] = useState(["UweF23", "UweF22", "TonyCerl", "JimWil", "大发发", "Jimberg", "m大Gsd哈"])
    const [peopleList, setPeopleList] = useState(props.peopleList || [])
    const [avatarPeopleList, setAvatarPeopleList] = useState(props.avatarPeopleList || [])

    const [voteArr, setVoteArr] = useState([])
    const [voteId, setVoteId] = useState("")
    const [voteTopic, setVoteTopic] = useState("")
    const [pollDuration, setPollDuration] = useState({ d: 3, h: 0, m: 0 })

    const clearState = useCallback(function () {

        setEditorState(EditorState.createEmpty())
        setImageObj({})
        setVoteArr([])
        setVoteId("")
        setVoteTopic("")

    }, [])



    return (

        <EditorContext.Provider value={{

            editorState, setEditorState,
            currentBlockKey, setCurrentBlockKey,

            // savedImageObj, setSavedImageObj,
            imageObj, setImageObj,
            imageBlockNum,

            peopleList, setPeopleList,
            avatarPeopleList, setAvatarPeopleList,
            downloadAvatarUrl,
            genAvatarLink,

            voteArr, setVoteArr,
            voteTopic, setVoteTopic,
            pollDuration, setPollDuration,
            voteId, setVoteId,

            onChange,
            onSubmit,


            clearState

        }}>
            <DraftEditor />
        </EditorContext.Provider>
    )
}

export function EditorViewer({ preHtml, peopleList = [], avatarPeopleList = [], genAvatarLink = () => { }, downloadImageUrl = "", downloadVoteUrl = "", downloadAvatarUrl = "" }) {

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

                return <VoteViewerBlock {...{ topic, duration, voteArr, expireDate, voteId, downloadVoteUrl }} />
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
                        // "& .MuiChip-root.MuiChip-filled": { fontSize: theme.scaleSizeObj(0.8), }
                        "& .MuiChip-root.MuiChip-filled": { fontSize: theme.sizeObj }
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
                        "& .MuiChip-root.MuiChip-filled": { fontSize: theme.scaleSizeObj(0.8), }

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
    }), [preHtml, theme])



    return (
        <Box sx={(theme) => {
            return {
                bgcolor: theme.colorBgObj, marginTop: "32px", marginBottom: "32px",
                borderRadius: "4px",
                boxShadow: 5,
                overflow: "hidden"

            }
        }}>
            {parse(preHtml, options)}
        </Box>

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
