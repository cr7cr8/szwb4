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
import createMentionPlugin from './MentionPlugin';
import createPersonPlugin from './PersonPlugin';
import createVotePlugin from './VotePlugin';


const { emojiPlugin, EmojiComp } = createEmojiPlugin()
const { imagePlugin, markingImageBlock, ImageBlock } = createImagePlugin()

const { votePlugin, markingVoteBlock, VoteBlock } = createVotePlugin()

const { mentionPlugin, taggingMention, checkShowing } = createMentionPlugin()
const { personPlugin } = createPersonPlugin()
const { hasCommandModifier } = KeyBindingUtil;





export default function DraftEditor() {



  const { editorState, setEditorState, currentBlockKey, setCurrentBlockKey } = useContext(EditorContext)

  const theme = useTheme()
  const editorRef = useRef()
  const specialBackSpace = useRef(false)

  const [readOnly, setReadOnly] = useState(false)

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
          position: "sticky", top: 0, justifyContent: "space-between",
          zIndex: 600,
          // bgcolor:"background.default",

        }}
      >
        <Stack direction="row" sx={{
          width: "10px", flexGrow: 1,
          bgcolor: theme.isLight ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
          backdropFilter: "blur(20px)"
        }}>
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
          readOnly={readOnly}
          editorState={editorState}
          ref={function (element) { editorRef.current = element; }}

          onFocus={function () { setShadowValue(5) }}
          onBlur={function () { setShadowValue(3) }}




          onChange={(newState) => {

            newState.getCurrentContent()

            const selection = newState.getSelection()
            const isCollapsed = selection.isCollapsed()
            const startKey = selection.getStartKey()

            if (specialBackSpace.current) {
              const newContentState = Modifier.replaceText(newState.getCurrentContent(), newState.getSelection(), "")
              newState = EditorState.push(newState, newContentState, "insert-characters")
              specialBackSpace.current = false
            }


            isCollapsed && setCurrentBlockKey(startKey)

            return setEditorState(newState)
          }}

          plugins={[


            emojiPlugin,
            imagePlugin,
            // linkPlugin,
            votePlugin,
            mentionPlugin,
            personPlugin,
          ]}


          blockRenderMap={
            Immutable.Map({

              "unstyled": {
                element: "div",
                wrapper: <EditingBlock
                  editorRef={editorRef}
                  markingImageBlock={markingImageBlock}
                  markingVoteBlock={markingVoteBlock}
                  VoteBlock={VoteBlock}
                  readOnly={readOnly}
                  setReadOnly={setReadOnly}
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
            else if (type === "voteBlock") {
              return {
                component: VoteBlock,
                editable: false,
                props: {
                  blockKey,
                  markingVoteBlock,
                  readOnly,
                  setReadOnly,
                },
              }
            }

          }}


          keyBindingFn={function (e, { getEditorState, setEditorState, ...obj }) {
            //return undefined to carry on
            const editorState = getEditorState()
            const selection = editorState.getSelection();

            const startKey = selection.getStartKey()
            const startOffset = selection.getStartOffset()

            const endKey = selection.getEndKey()
            const endOffset = selection.getEndOffset()

            const anchorKey = selection.getAnchorKey()
            const anchorOffset = selection.getAnchorOffset()
            const focusKey = selection.getFocusKey()
            const focusOffset = selection.getFocusOffset()

            const isCollapsed = selection.isCollapsed()
            const isInOrder = !selection.getIsBackward()
            const hasFocus = selection.getHasFocus()

            // console.log(startKey, startOffset, endKey, endOffset, anchorKey, anchorOffset, focusKey, focusOffset, isCollapsed, isInOrder, hasFocus)


            const contentState = editorState.getCurrentContent();
            const allBlocks = contentState.getBlockMap()

            const block = contentState.getBlockForKey(startKey);
            const blockText = block.getText()

            const keyBefore = contentState.getKeyBefore(startKey)
            const blockBefore = contentState.getBlockBefore(startKey)

            const firstBlockKey = allBlocks.slice(0, 1).toArray().shift().getKey()


            if ((e.keyCode === 8) && (isCollapsed) && (blockText.length === 0) && (startOffset === 0) && (startKey !== firstBlockKey)) {

              let newContentState = Modifier.replaceText(contentState, selection, "#")
              let es = EditorState.push(editorState, newContentState, "insert-characters")


              es = deleteBlock2(es, startKey, setEditorState)
              let newSelection = es.getSelection()

              newSelection = newSelection.merge({

                anchorOffset: newSelection.getAnchorOffset() + 0,  //hilight +0   ,not hilight +1
                focusOffset: newSelection.getFocusOffset() + 1
              })

              es = EditorState.forceSelection(es, newSelection)

              specialBackSpace.current = true

              setCurrentBlockKey(es.getSelection().getStartKey())
              setEditorState(es)

              return "dummy"
            }
            else if ((e.keyCode === 8) && (isCollapsed) && (startOffset === 0) && (startKey !== firstBlockKey)) {
              deleteBlock1(editorState, startKey, setEditorState)
              return ("done")
            }
            else if (checkShowing() && e.keyCode === 38) {
              return undefined
            }
            else if (checkShowing() && e.keyCode === 40) {
              return undefined
            }

            // if ((block.getType() === "imageBlock")) {
            //   return "cancel-delete"
            // }

            else if (e.shiftKey || hasCommandModifier(e) || e.altKey) {
              return getDefaultKeyBinding(e);
            }
            return undefined

          }}

          handleKeyCommand={function (command, editorState, evenTimeStamp, { getEditorState }) {
            // return undefiend and return not-handled will be igonred in handleKeyCommand

            //  const newState = RichUtils.handleKeyCommand(editorState, command);

            if (command === "deletemore") {
              alert("fff")
              //RichUtils.handleKeyCommand(editorState, "deletemore")
              return editorState
              //  alert("dfdf")
            }

            // if (command === "backspace") {    //builtin command when hit backspace if not binded in keypress
            //   //   RichUtils.handleKeyCommand(editorState, "deletemore")
            // }


            if (command === "moveUp" || command === "moveDown") {
              const selection = editorState.getSelection();
              const startKey = selection.getStartKey();
              const endKey = selection.getEndKey();
              const isCollapsed = selection.isCollapsed()


              const upperBlockKey = editorState.getCurrentContent().getKeyBefore(startKey)
              const block = editorState.getCurrentContent().getBlockForKey(command === "moveUp" ? startKey : endKey)
              const lowerBlockKey = editorState.getCurrentContent().getKeyAfter(endKey)

              if ((command === "moveUp" && upperBlockKey) || ((command === "moveDown" && lowerBlockKey))) {

                const adjacentBlock = command === "moveUp"
                  ? editorState.getCurrentContent().getBlockBefore(startKey)
                  : editorState.getCurrentContent().getBlockAfter(endKey)
                const text = adjacentBlock.getText()

                let newSelection = selection.merge({

                  ...isCollapsed && { anchorKey: adjacentBlock.getKey() },
                  ...isCollapsed && { anchorOffset: text ? text.length : 0 },

                  focusKey: adjacentBlock.getKey(),
                  focusOffset: adjacentBlock.getKey() ? text.length : 0,

                  isBackward: false,
                  hasFocus: true,
                })
                //  externalES = EditorState.push(externalES, newContent, "insert-characters");
                let es = EditorState.forceSelection(editorState, newSelection)
                setEditorState(es)
              }
              else if ((command === "moveUp" && !upperBlockKey) || ((command === "moveDown" && !lowerBlockKey))) {

                const text = block.getText()

                let newSelection = selection.merge({
                  anchorKey: block.getKey(),
                  anchorOffset: command === "moveUp" ? 0 : text ? text.length : 0,
                  focusKey: block.getKey(),
                  focusOffset: command === "moveUp" ? 0 : text ? text.length : 0,
                  isBackward: false,
                  hasFocus: true,
                })
                let es = EditorState.forceSelection(editorState, newSelection)
                setEditorState(es)
              }
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
            return 'not-handled';

          }}

          handleBeforeInput={function (aaa, editorState) {


          }}

          handleReturn={function (e, newState, { getEditorState, setEditorState }) {
            const editorState = newState;// getEditorState()
            const selectionState = editorState.getSelection();
            let contentState = newState.getCurrentContent();
            const block = contentState.getBlockForKey(selectionState.getStartKey());
            //    console.log(block.getType())
            if (block.getType() === "imageBlock") {
              return "handled"
            }
            else if (block.getType() === "voteBlock") {
              return "handled"
            }
            // else if (checkShowing()) {
            //   return "handled"
            // }

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





function deleteBlock1(store, blockKey, setEditorState) {
  // const editorState = store.getEditorState();

  const editorState = store;
  let content = editorState.getCurrentContent();

  const beforeKey = content.getKeyBefore(blockKey);
  const beforeBlock = content.getBlockForKey(beforeKey);
  const beforeBlockText = beforeBlock && beforeBlock.getText();
  // Note: if the focused block is the first block then it is reduced to an
  // unstyled block with no character
  if (beforeBlock === undefined) {
    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
    // change the blocktype and remove the characterList entry with the sticker
    content = Modifier.removeRange(content, targetRange, 'backward');
    content = Modifier.setBlockType(
      content,
      targetRange,
      'unstyled'
    );
    const newState = EditorState.push(editorState, content, 'remove-block');

    // force to new selection
    const newSelection = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0,
    });
    return EditorState.forceSelection(newState, newSelection);
  }


  //alert(`beforeTextLength ${beforeBlock.getText().length}  anchorKey ${beforeKey}  anchorOffset: ${beforeBlock.getLength()}   focusKey ${blockKey}  `)

  const targetRange = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),//beforeBlockText && beforeBlockText.length || 0,// beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: 0,   // one in colorblock or editingBlock
  });

  content = Modifier.removeRange(content, targetRange, 'backward');
  const newState = EditorState.push(editorState, content, 'remove-block');



  // force to new selection

  const newSelection = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: beforeKey,
    focusOffset: beforeBlock.getLength(),
  });


  setEditorState(EditorState.forceSelection(newState, newSelection))



  // return EditorState.acceptSelection(newState, newSelection);
}


function deleteBlock2(store, blockKey) {
  // const editorState = store.getEditorState();

  const editorState = store;
  let content = editorState.getCurrentContent();

  const beforeKey = content.getKeyBefore(blockKey);
  const beforeBlock = content.getBlockForKey(beforeKey);
  const beforeBlockText = beforeBlock && beforeBlock.getText();
  // Note: if the focused block is the first block then it is reduced to an
  // unstyled block with no character
  if (beforeBlock === undefined) {
    const targetRange = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 1,
    });
    // change the blocktype and remove the characterList entry with the sticker
    content = Modifier.removeRange(content, targetRange, 'backward');
    content = Modifier.setBlockType(
      content,
      targetRange,
      'unstyled'
    );
    const newState = EditorState.push(editorState, content, 'remove-block');

    // force to new selection
    const newSelection = new SelectionState({
      anchorKey: blockKey,
      anchorOffset: 0,
      focusKey: blockKey,
      focusOffset: 0,
    });
    return EditorState.forceSelection(newState, newSelection);
  }


  //alert(`beforeTextLength ${beforeBlock.getText().length}  anchorKey ${beforeKey}  anchorOffset: ${beforeBlock.getLength()}   focusKey ${blockKey}  `)

  const targetRange = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),//beforeBlockText && beforeBlockText.length || 0,// beforeBlock.getLength(),
    focusKey: blockKey,
    focusOffset: 0,   // one in colorblock or editingBlock
  });

  content = Modifier.removeRange(content, targetRange, 'backward');
  const newState = EditorState.push(editorState, content, 'remove-block');



  // force to new selection

  const newSelection = new SelectionState({
    anchorKey: beforeKey,
    anchorOffset: beforeBlock.getLength(),
    focusKey: beforeKey,
    focusOffset: beforeBlock.getLength(),
  });


  //setEditorState(EditorState.forceSelection(newState, newSelection))



  return EditorState.forceSelection(newState, newSelection);
}


