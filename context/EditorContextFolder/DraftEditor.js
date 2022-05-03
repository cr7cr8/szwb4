import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo, useId } from 'react';

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';


import NoSsr from '@mui/material/NoSsr';

import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Button, Switch, Box, Hidden } from '@mui/material';
import Editor from "@draft-js-plugins/editor";

import Immutable from 'immutable';


import { EditorContext } from "../EditorContextProvider"

import { isChrome, useDeviceData } from 'react-device-detect';

import { EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined } from '@mui/icons-material';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';

import EditingBlock from './EditingBlock';
import createEmojiPlugin from './EmojiPlugin';
import createImagePlugin from './ImagePlugin';
const { emojiPlugin, EmojiComp } = createEmojiPlugin()
const { imagePlugin, markingImageBlock, ImageBlock } = createImagePlugin()


const isWindow = (typeof window === "undefined") ? false : true

export default function DraftEditor() {



    const { editorState, setEditorState, currentBlockKey, setCurrentBlockKey } = useContext(EditorContext)

    const theme = useTheme()

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


    const [shadowValue, setShadowValue] = useState(3)



    return (
        <>
            {/* <NoSsr fallback={<></>}> */}


            <Stack direction="row"
                sx={{
                    position: "sticky", bottom: 0, justifyContent: "space-between"
                }}
            >
                <Stack direction="row" sx={{ width: "10px", flexGrow: 1, /*bgcolor: "pink",*/ }}>
                    <EmojiComp editorRef={editorRef} />

                    <IconButton size="small" onClick={function (e) {
                        e.preventDefault()
                        e.stopPropagation()


                        const blockType = editorState.getCurrentContent().getBlockForKey(currentBlockKey).getType()
                        if (blockType === "imageBlock") { return }


                        const data = editorState.getCurrentContent().getBlockForKey(currentBlockKey).getData().toObject()



                        const newContent = Modifier.setBlockData(
                            editorState.getCurrentContent(),
                            SelectionState.createEmpty(currentBlockKey),//  editorState.getSelection(), // SelectionState.createEmpty(currentBlockKey),
                            Immutable.Map({ isSmallFont: !Boolean(data.isSmallFont) })
                        )


                        const es = EditorState.push(editorState, newContent, 'change-block-data');
                        setEditorState(es)

                    }} >
                        <FormatSize fontSize="large" />
                    </IconButton>

                    <IconButton size="small" onClick={function () {
                        const es = RichUtils.toggleBlockType(
                            editorState, // write type to editorState
                            "unstyled"
                        )
                        setTimeout(() => {
                            setEditorState(EditorState.forceSelection(es, es.getSelection()))
                        }, 0);

                    }}>
                        <FormatAlignLeft fontSize="large" />
                    </IconButton>

                    <IconButton size="small" onClick={function () {
                        const es = RichUtils.toggleBlockType(
                            editorState, // write type to editorState
                            "centerBlock"
                        )
                        setTimeout(() => {
                            setEditorState(EditorState.forceSelection(es, es.getSelection()))
                        }, 0);
                    }}>
                        <FormatAlignCenter fontSize="large" />
                    </IconButton>

                    <IconButton size="small" onClick={function () {
                        const es = RichUtils.toggleBlockType(
                            editorState, // write type to editorState
                            "rightBlock"
                        )
                        setTimeout(() => {
                            setEditorState(EditorState.forceSelection(es, es.getSelection()))
                        }, 0);
                    }}>
                        <FormatAlignRight fontSize="large" />
                    </IconButton>

                    <IconButton size="small" onClick={function () {
                        setEditorState(addEmptyBlock(editorState))
                        // const es = RichUtils.toggleBlockType(
                        //   editorState, // write type to editorState
                        //   "rightBlock"
                        // )
                        // setTimeout(() => {
                        //   setEditorState(EditorState.forceSelection(es, es.getSelection()))
                        // }, 0);
                    }}>
                        <HorizontalSplitOutlined fontSize="large" />
                    </IconButton>

                    <Switch
                        sx={{ position: "absolute", right: -10 }}
                        checked={!theme.isLight}
                        onChange={function (event) {
                            event.target.checked
                                ? theme.setMode("dark")
                                : theme.setMode("light")
                        }}
                    />
                </Stack>
            </Stack>
            <Paper
                id="frame-editor"
                //  ref={frameRef}
                style={{
                    position: "relative", wordBreak: "break-all", //top: "5vh"
                    //  minHeight: "8rem"
                }}

                onClick={function () {
                    // setTimeout(function () {
                    //   const es = EditorState.forceSelection(editorState, editorState.getSelection())
                    //   setEditorState(es)
                    // }, 0)
                }}
                sx={{
                    //  fontSize: theme.sizeObj,
                    bgcolor: 'background.default',
                    boxShadow: shadowValue
                }}
            >


                <Editor
                    editorKey={useId()}
                    editorState={editorState}
                    ref={function (element) { editorRef.current = element; }}

                    onFocus={function () { setShadowValue(5) }}
                    onBlur={function () { setShadowValue(3) }}




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
            </Paper>
            {/* </NoSsr> */}



            <div style={{ whiteSpace: "pre-wrap", display: "flex", fontSize: 15 }}>
                <div>{JSON.stringify(editorState.getCurrentContent(), null, 2)}</div>
                <hr />
                <div>{JSON.stringify(convertToRaw(editorState.getCurrentContent()), null, 2)}</div>
            </div>

        </>
    )


}



const addEmptyBlock = (editorState) => {
    const newBlock = new ContentBlock({
      key: "m" + String(Math.random()).substring(2, 6),
      type: 'unstyled',
      text: '',
      characterList: Immutable.List()
    })
  
    // console.log(newBlock.key)
    const contentState = editorState.getCurrentContent()
    const newBlockMap = contentState.getBlockMap().set(newBlock.key, newBlock)
  
    return EditorState.push(
      editorState,
      ContentState
        .createFromBlockArray(newBlockMap.toArray())
        .set('selectionBefore', contentState.getSelectionBefore())
        .set('selectionAfter', contentState.getSelectionAfter())
    )
  }