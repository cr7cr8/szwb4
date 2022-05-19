
import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo, useId } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import {
  EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
  RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';



import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Button, Switch, Box, Hidden, Collapse, Divider } from '@mui/material';
import Editor from "@draft-js-plugins/editor";

import Immutable from 'immutable';


import { EditorContext } from "../EditorContextProvider"

import { isChrome, useDeviceData } from 'react-device-detect';

import {
  EmojiEmotions, FormatSize, FormatAlignLeft, FormatAlignCenter, FormatAlignRight, StackedBarChart, HorizontalSplitOutlined,

  ColorLensOutlined,
  Circle, Send, Edit

} from '@mui/icons-material';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';



import EditingBlock from './EditingBlock';
import createEmojiPlugin from './EmojiPlugin';

import createLinkPlugin from './LinkPlugin';
import createMentionPlugin from './MentionPlugin';
import createPersonPlugin from './PersonPlugin';



const { emojiPlugin, EmojiComp } = createEmojiPlugin()

const { linkPlugin, taggingLink, taggingLocalLink } = createLinkPlugin()


const { mentionPlugin, taggingMention, checkShowing } = createMentionPlugin()
const { personPlugin } = createPersonPlugin()
const { hasCommandModifier } = KeyBindingUtil;


import axios from "axios"



export default function SimpleEditor() {

  const { userName,
    editorState, setEditorState,
    currentBlockKey, setCurrentBlockKey,
    contentId,
    onSubmit,
  } = useContext(EditorContext)
  const editorRef = useRef()

  const theme = useTheme()
  const colorObj = theme.colorObj
  const colorBgObj = theme.colorBgObj



  useEffect(function () {

    // console.log(contentId)
    setEditorState(taggingLocalLink(editorState))
    //setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()))


  }, [colorObj])

  useEffect(function () {
   // window.currenContentId = contentId

    editorRef.current.focus()
  }, [])




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
        //paddingLeft: "4px",
        "& [data-editor]": { paddingLeft: "4px" },

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
            mentionPlugin,
            emojiPlugin,
            linkPlugin,

            personPlugin,
          ]}


        />

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <EmojiComp editorRef={editorRef} isSimple={true} />
          <IconButton size='small' onClick={function () {
            console.log(toPreHtml({ editorState }))
            console.log(contentId)


            const newComment = {
              _id: "comment-" + Date.now(),
              content: toPreHtml({ editorState }),
              ownerName: userName,
              contentId: contentId,
              postDate: Date.now()
            }


            onSubmit && setTimeout(function () { onSubmit(newComment) })







          }}>
            <Send fontSize='medium' />
          </IconButton>
        </Box>

      </Box>

    </>
  )
}



function toPreHtml({ editorState, theme, voteArr, voteTopic, pollDuration, voteId, imageObj, imageBlockNum }) {



  const preHtml = stateToHTML(
    editorState.getCurrentContent(),
    {
      defaultBlockTag: "div",

      inlineStyleFn: function (styleNameSet) {

        const styleObj = {
          element: "span",
          style: {},
          attributes: {}
        }


        const isLink = styleNameSet.toArray().some(item => {
          return (item.indexOf("linkTagOn") >= 0) || (item.indexOf("linkTagOff") >= 0)
        })


        if (isLink) {

          styleObj.attributes["data-type"] = "link"
        }

        return styleObj
      },


      entityStyleFn: function (entity) {
        const { type, data, mutablity } = entity.toObject()

        //  console.log(type, data, mutablity)

        if (type.indexOf("mention") >= 0) {
          return {
            element: 'object',
            attributes: {
              "data-type": "mention-tag"
            },
          }
        }
        else if (type.indexOf("personTag") >= 0) {
          return {
            element: 'object',
            attributes: {
              "data-type": "person-tag"
            },

          }

        }

      },

      blockStyleFn: function (block) {

        const text = block.getText()
        const data = block.getData().toObject()
        const type = block.getType()
        const key = block.getKey()

        return {
          style: {
            ...(type === "centerBlock") && { textAlign: "center" },  // style will be a string not an object during toHtmll call
            ...(type === "rightBlock") && { textAlign: "right" },


            // ...(data.isSmallFont&&type==="rightBlock")&&{transform:"translateX(10%) scale(0.8) ",backgroundColor:"pink",lineHeight:1},
            // ...(data.isSmallFont&&type==="unstyled")&&{transform:"translateX(-10%) scale(0.8) ",backgroundColor:"pink",lineHeight:1},
            // ...(data.isSmallFont&&type==="centerBlock")&&{transform:"scale(0.8) ",backgroundColor:"pink",lineHeight:1},

            // ...styleObj.centerBlock && { textAlign: "center" },
            // ...styleObj.rightBlock && { textAlign: "right" }

          },
          attributes: {
            ...data.isSmallFont && { "small-font": "small-font" },
            ...(type === "centerBlock") && { "text-align": "center" },
            ...(type === "rightBlock") && { "text-align": "right" },

            // ...styleObj.centerBlock && { className: "text-center" },
            // ...styleObj.rightBlock && { className: "text-right" }
          }
        }

      },

      blockRenderers: {

        imageBlock: function (block) {

          const text = block.getText()
          const data = encodeURI(JSON.stringify(block.getData().toObject()))
          const type = block.getType()
          const key = block.getKey()

          // object Tag caanot self close
          if (!imageObj[key]) { return }
          const imageHtml = imageObj[key].reduce(function (imageHtml, currentValue, index, arr) {
            return imageHtml = imageHtml + `<object data-imageindex="${index}" data-imgurl="${arr[index].imgUrl}" data-imgsnap="${arr[index].imgSnap}" data-blockkey="${key}" ></object>`
          }, "")

          return `<object data-type="image-block"  data-block_key="${key}" >` + imageHtml + '</object>'
        },

        voteBlock: function (block) {
          const { d, h, m } = pollDuration
          const expireDate = new Date(Date.now() + (3600 * 24 * d + 3600 * h + 60 * m) * 1000)

          const voteTopicHtml = `<object data-topic>${voteTopic || ""}</object>`
          const pollDurationHtml = `<object data-duration>${JSON.stringify(pollDuration).trim()}</object>`
          const voteArrHtml = voteArr.map((vote, index) => `<object data-item-${index}>${vote}</object>`)

          const data = encodeURI(JSON.stringify({ ...block.getData().toObject() }))
          const type = block.getType()
          const key = block.getKey()


          // return `< object data - vote_arr="${voteArr}" data - type="vote-block"  data - block_key="${key}" data - block_data="${data}" > ` + encodeURI(block.getText()) + '</object>'
          return `<object data-vote_arr="${voteArr}" date-vote_id="${voteId}" date-expire_date="${expireDate}" data-type="vote-block"  data-block_key="${key}" data-block_data="${data}">` + voteTopicHtml + pollDurationHtml + voteArrHtml.join("") + '</object>'

        },

      },



    }
  )
  return preHtml
}