import React, { useState, createContext } from "react"

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

import DraftEditor from "./EditorContextFolder/DraftEditor"


export const EditorContext = createContext()



const rawJsText = {
    "entityMap": {},
    "blocks": [
        // {
        //     "key": "e4brl",
        //     "text": "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.",
           
        //     "type": "unstyled",
        //     "depth": 0,
        //     "inlineStyleRanges": [
        //         // {
        //         //     "offset": 0,
        //         //     "length": 11,
        //         //     "style": "BOLD"
        //         // },
        //         // {
        //         //     "offset": 28,
        //         //     "length": 29,
        //         //     "style": "BOLD"
        //         // },
        //         // {
        //         //     "offset": 12,
        //         //     "length": 15,
        //         //     "style": "ITALIC"
        //         // },
        //         // {
        //         //     "offset": 28,
        //         //     "length": 28,
        //         //     "style": "ITALIC"
        //         // }
        //     ],
        //     "entityRanges": [],
        //     "data": {}
        // },
        {
            "key": "3bflg",
            "text": "",
            "type": "unstyled",
            "depth": 0,
            "inlineStyleRanges": [],
            "entityRanges": [],
            "data": {}
        }
    ]
};
const content = convertFromRaw(rawJsText);

export function EditorContextProvider({

    savedEditorState, setSavedEditorState,
    savedImageObj, setSavedImageObj,
    savedVoteArr, setSavedVoteArr,
    savedVoteTopic, setSavedVoteTopic,
    savedPollDuration, setSavedPollDuration


}) {

    const [editorState, setEditorState] = useState(savedEditorState || EditorState.createWithContent(content) || EditorState.createEmpty())

    return (

        <EditorContext.Provider value={{
            editorState, setEditorState
        }}>
            <DraftEditor />
        </EditorContext.Provider>
    )
}