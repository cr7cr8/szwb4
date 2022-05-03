import React, { useState, createContext, useMemo, useId } from "react"

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

import DraftEditor from "./EditorContextFolder/DraftEditor"


export const EditorContext = createContext()





export function EditorContextProvider({

    savedEditorState, setSavedEditorState,
    savedImageObj, setSavedImageObj,
    savedVoteArr, setSavedVoteArr,
    savedVoteTopic, setSavedVoteTopic,
    savedPollDuration, setSavedPollDuration


}) {

    // const key1 = useId().replace(":", "").replace(":", "")
    const rawJsText = useMemo(() => {

        return {
            "entityMap": {},
            "blocks": [
                {
                    "key": "1111",
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


    const [editorState, setEditorState] = useState(savedEditorState || EditorState.createWithContent(convertFromRaw(rawJsText)) || EditorState.createEmpty())

    const [currentBlockKey, setCurrentBlockKey] = useState("ddd")

    const [imageObj, setImageObj] = useState(savedImageObj || {})
    const imageBlockNum = editorState.getCurrentContent().getBlocksAsArray().filter(block => block.getType() === "imageBlock").length


    const [peopleList, setPeopleList] = useState(["UweF23", "UweF22", "TonyCerl", "JimWil", "大发发", "Jimberg", "m大Gsd哈"])

    return (

        <EditorContext.Provider value={{

            editorState, setEditorState,
            currentBlockKey, setCurrentBlockKey,

            savedImageObj, setSavedImageObj,
            imageObj, setImageObj,
            imageBlockNum,
            peopleList, setPeopleList,

        }}>
            <DraftEditor />
        </EditorContext.Provider>
    )
}