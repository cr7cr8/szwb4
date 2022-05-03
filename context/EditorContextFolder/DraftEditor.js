import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo } from 'react';

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

import NoSSR from 'react-no-ssr';

import Editor from "draft-js-plugins-editor";
import Immutable from 'immutable';


import { EditorContext } from "../EditorContextProvider"

import { isChrome, useDeviceData } from 'react-device-detect';

import createEmojiPlugin from './EmojiPlugin';
const { emojiPlugin, EmojiComp } = createEmojiPlugin()


const isWindow = (typeof window === "undefined") ? false : true

export default function DraftEditor() {



    const { editorState, setEditorState } = useContext(EditorContext)


    const deviceData = isWindow && useDeviceData()



    const editorRef = useRef()

    const [autoFocused, setAutoFocused] = useState(false)

    useEffect(function () {


        setTimeout(function () {

            if (!autoFocused) {
                setAutoFocused(true)
                setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()))

            }

        }, 50)

    }, [editorState, autoFocused])



    return (
        <>
           <EmojiComp editorRef={editorRef} />
            <NoSSR onSSR={<></>}>
                <Editor
                    editorState={editorState}
                    ref={function (element) { editorRef.current = element; }}
                    onChange={(newState) => {
                        return setEditorState(newState)

                    }}

                    plugins={[


                         emojiPlugin,
                        // imagePlugin,
                        // linkPlugin,
                        // votePlugin,
                        // mentionPlugin,
                        // personPlugin,
                    ]}
                /> 
            </NoSSR>


            <h1>DraftEditor</h1>


        </>
    )


}


