import React, { useState, createContext } from "react"

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

   const [editorState, setEditorState] = useState(savedEditorState || EditorState.createEmpty())

    return (

        <EditorContext.Provider value={{
            editorState, setEditorState
        }}>
            <DraftEditor />
        </EditorContext.Provider>
    )
}