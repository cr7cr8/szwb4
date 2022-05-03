import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo, useId } from 'react';

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';


import NoSsr from '@mui/material/NoSsr';


import Editor from "@draft-js-plugins/editor";

import Immutable from 'immutable';


import { EditorContext } from "../EditorContextProvider"

import { isChrome, useDeviceData } from 'react-device-detect';

import EditingBlock from './EditingBlock';
import createEmojiPlugin from './EmojiPlugin';
import createImagePlugin from './ImagePlugin';
const { emojiPlugin, EmojiComp } = createEmojiPlugin()
const { imagePlugin, markingImageBlock, ImageBlock } = createImagePlugin()


const isWindow = (typeof window === "undefined") ? false : true

export default function DraftEditor() {



    const { editorState, setEditorState, currentBlockKey, setCurrentBlockKey } = useContext(EditorContext)


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
            {/* <NoSsr fallback={<></>}> */}
            <EmojiComp editorRef={editorRef} />

            <Editor
                editorKey={useId()}
                editorState={editorState}
                ref={function (element) { editorRef.current = element; }}
                onChange={(newState) => {

                    const selection = newState.getSelection()
                    const isCollapsed = selection.isCollapsed()
                    const startKey = selection.getStartKey()



                    isCollapsed && setCurrentBlockKey(startKey)

                    return setEditorState(newState)
                }}

                plugins={[


                    emojiPlugin,
                    imagePlugin,
                    // linkPlugin,
                    // votePlugin,
                    // mentionPlugin,
                    // personPlugin,
                ]}


                blockRenderMap={
                    Immutable.Map({

                        "unstyled": {
                            element: "div",
                            wrapper: <EditingBlock
                                editorRef={editorRef}
                                markingImageBlock={markingImageBlock}
                            // markingVoteBlock={markingVoteBlock}
                            // VoteBlock={VoteBlock}
                            // readOnly={readOnly}
                            // setReadOnly={setReadOnly}
                            />
                        },
                    })
                }




                blockRendererFn={function (block) {

                    const text = block.getText()
                    const data = block.getData().toObject()
                    const type = block.getType()
                    const blockKey = block.getKey()
                    const selection = editorState.getSelection()

                    if (type === "imageBlock") {
                        return {
                            component: ImageBlock,
                            editable: false,
                            props: {
                                blockKey,
                                markingImageBlock,
                            },
                        }
                    }

                }}










                keyBindingFn={function (e, { getEditorState, setEditorState, ...obj }) {

                    if ((e.keyCode === 65)) {
                        return "fire-arrow";
                    }
                    return undefined
                }}
                handleKeyCommand={function (command, editorState, evenTimeStamp, { setEditorState }) {

                    if (command === "fire-arrow") {

                        //  alert("a")
                        console.log("a==---")
                        return undefined
                    }
                    if (command === "bold") {

                        setEditorState(RichUtils.handleKeyCommand(editorState, command))
                    }
                    if (command === "italic") {

                        setEditorState(RichUtils.handleKeyCommand(editorState, command))
                    }
                    if (command === "underline") {

                        setEditorState(RichUtils.handleKeyCommand(editorState, command))
                    }
                    return undefined
                }}
            />
            {/* </NoSsr> */}



            <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>
                <div>{JSON.stringify(editorState.getCurrentContent(), null, 2)}</div>
                <hr />
                <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, 2)}</div>
            </div>

        </>
    )


}


