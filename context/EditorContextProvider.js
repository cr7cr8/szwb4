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

import Countdown from "react-countdown";
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Button, Switch, Box, Hidden, Collapse, Typography, Divider } from '@mui/material';

import { Close } from "@mui/icons-material";
import axios from "axios";

export const EditorContext = createContext()

export function EditorContextProvider({

    userName,
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
            userName,
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

