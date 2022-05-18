
import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo, useId } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import {
  EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
  RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';



import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Button, Switch, Box, Hidden, Collapse } from '@mui/material';
import Editor from "@draft-js-plugins/editor";

import Immutable from 'immutable';


import { EditorContext } from "../EditorContextProvider"

import { isChrome, useDeviceData } from 'react-device-detect';

import {
  EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined,

  ColorLensOutlined,
  Circle

} from '@mui/icons-material';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';



import EditingBlock from './EditingBlock';
import createEmojiPlugin from './EmojiPlugin';

import createLinkPlugin from './LinkPlugin';
import createMentionPlugin from './MentionPlugin';
import createPersonPlugin from './PersonPlugin';



const { emojiPlugin, EmojiComp } = createEmojiPlugin()

const { linkPlugin, taggingLink } = createLinkPlugin()


const { mentionPlugin, taggingMention, checkShowing } = createMentionPlugin()
const { personPlugin } = createPersonPlugin()
const { hasCommandModifier } = KeyBindingUtil;


import axios from "axios"



export default function SimpleEditor() {

  const { userName,
    editorState, setEditorState,
    currentBlockKey, setCurrentBlockKey,
    contentId,
  } = useContext(EditorContext)
  const editorRef = useRef()

  const theme = useTheme()
  const colorObj = theme.colorObj
  const colorBgObj = theme.colorBgObj



  useEffect(function () {

    // console.log(contentId)
    //  setEditorState(taggingLink())
    setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()))


  }, [colorObj])






  return (

    <>
      <Box sx={{
        bgcolor: theme.palette.background.default,
        position: "relative", wordBreak: "break-all", //top: "5vh"
        //margin: "4px",
        "m": "1px",
        borderRadius: "4px",
        // boxShadow: 5,
        // width:100,
        // border: `${isOnFocus?"1px":"0px"} solid ${blue[500]}`,
        paddingLeft: "4px",
        fontSize: theme.sizeObj,
      }}>
        <Editor
          editorKey={contentId}
          editorState={editorState}
          ref={function (element) { editorRef.current = element; }}

          onChange={(newState) => {

            newState.getCurrentContent()

            const selection = newState.getSelection()
            const isCollapsed = selection.isCollapsed()
            const startKey = selection.getStartKey()

            // if (specialBackSpace.current) {
            //   const newContentState = Modifier.replaceText(newState.getCurrentContent(), newState.getSelection(), "")
            //   newState = EditorState.push(newState, newContentState, "insert-characters")
            //   specialBackSpace.current = false
            // }


            isCollapsed && setCurrentBlockKey(startKey)

            return setEditorState(newState)
          }}
          customStyleFn={function (style, block) {
            const styleNameArr = style.toArray();
            const styleObj = {}

            styleNameArr.forEach(item => {
              if (item.indexOf("linkTagOn") >= 0) {
                // styleObj.color = theme.isLight ? colorObj[500] : colorObj[300]
                styleObj.textDecoration = "underline"
                styleObj["--mylinkcolor"] = theme.isLight ? colorObj[500] : colorObj[300]
                styleObj["color"] = "var(--mylinkcolor)"
                styleObj["transition"] = "all 1000ms"
              }
              if (item.indexOf("linkTagOff") >= 0) {
                //   styleObj.color = theme.isLight ? colorObj[500] : colorObj[300]
                styleObj["--mylinkcolor"] = theme.isLight ? colorObj[500] : colorObj[300]
                styleObj["color"] = "var(--mylinkcolor)"
                styleObj["transition"] = "all 1000ms"
              }
            })
            if (styleNameArr.length > 0) {
              return styleObj
            }

          }}


          plugins={[
            emojiPlugin,
            linkPlugin,
            mentionPlugin,
            personPlugin,
          ]}


        />
      </Box>
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <EmojiComp editorRef={editorRef} isSimple={true} />
      </Box>
    </>


  )

}