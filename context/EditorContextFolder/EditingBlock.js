import React, { useState, useRef, useEffect, useContext, useCallback, createContext, useMemo, useTransition } from 'react';
import { EditorContext } from "../EditorContextProvider";
import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Box } from '@mui/material';
import { ImageOutlined, StackedBarChart } from '@mui/icons-material';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';



export default function EditingBlock({ VoteBlock, readOnly, setReadOnly, markingImageBlock, markingVoteBlock, children, ...props }) {


    const [isPending, startTransition] = useTransition()

    const {
        currentBlockKey, editorState, imageBlockNum, setEditorState,

        imageObj, setImageObj,


    } = useContext(EditorContext)


    const hasVoteBlock = Boolean(editorState.getCurrentContent().getBlocksAsArray().filter(block => {
        return block.getType() === "voteBlock"
    }).length);




    const selection = editorState.getSelection()
    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()
    const isCollapsed = selection.isCollapsed()

    const block = editorState.getCurrentContent().getBlockForKey(currentBlockKey)//.getText();

    const currentBlockText = block && block.getText()
    const currentBlockType = block && block.getType()

    const theme = useTheme()
    const colorObj = theme.colorObj
    const colorBgObj = theme.colorBgObj

    return (

        <>
            {children.map(block => {

                const blockKey = block.key
                const blockType = editorState.getCurrentContent().getBlockForKey(block.key).getType()
                const blockData = editorState.getCurrentContent().getBlockForKey(block.key).getData().toObject()

                const isCurrentRow = (blockKey === currentBlockKey) && (hasfocus) && (isCollapsed)

                if (blockType === "imageBlock") {

                    return <Box key={blockKey}
                        sx={{

                            bgcolor: colorBgObj,

                            "& + &": { paddingTop: "2px" }
                        }}>{block}</Box>
                }
                else if (blockType === "voteBlock") {

                    return <Box key={blockKey} sx={{
                        bgcolor: colorBgObj,
                        "& + &": { paddingTop: "2px" }
                    }}>{block}</Box>
                }


                return (
                    <Box

                        key={blockKey}
                        style={{

                        }}

                        sx={{

                            ...(blockData.isSmallFont) && { fontSize: theme.scaleSizeObj(0.8) },
                            ...(blockType === "unstyled") && { "& > div": { textAlign: "left", width: "100%" } },
                            ...(blockType === "centerBlock") && { "& > div": { textAlign: "center", width: "100%" } },
                            ...(blockType === "rightBlock") && { "& > div": { textAlign: "right", width: "100%" } },




                            paddingLeft: "2px",
                            paddingRight: "2px",

                            // boxShadow: isCurrentRow ? 3 : 0,
                            // transform: isCurrentRow ? `scale(1.03)` : `scale(1)`,
                            // ...isCurrentRow && { backgroundColor: theme.palette.background.default },
                            // ...isCurrentRow && (currentBlockType !== "unstyled") && { transform: `scale(1)` },



                            transition: "box-shadow, background-color, transform, 300ms",

                            position: "relative",
                            zIndex: isCurrentRow ? 100 : 0,
                            display: "flex",
                            alignItems: "center",
                            // ...(theme.palette.mode === "dark") && isCurrentRow && {

                            //     backgroundColor: "rgba(10, 10, 10, 1)"

                            // }


                        }}
                    >
                        <IconButton sx={{
                            fontSize: "2rem", width: "2.5rem", height: "2.5rem", position: "absolute",
                            ...(blockType === "rightBlock") ? { left: 0 } : { right: 0 },
                            opacity: (isCurrentRow && !Boolean(currentBlockText) && (imageBlockNum < 3) && (blockType !== "imageBlock") && (blockType !== "voteBlock")) ? 1 : 0,
                            transform: (isCurrentRow && !Boolean(currentBlockText) && (imageBlockNum < 3) && (blockType !== "imageBlock") && (blockType !== "voteBlock")) ? "scale(1)" : "scale(0)",
                            transition: "opacity, 300ms"


                        }}
                            size="small"

                            contentEditable={false} suppressContentEditableWarning={true}
                            onClick={function () {

                                //  startTransition(function (){

                                //      markingImageBlock(blockKey)
                                //   })
                                setTimeout(function () {

                                    markingImageBlock(blockKey)
                                }, 0)

                            }}
                        >
                            <ImageOutlined fontSize="large" />
                        </IconButton>

                        <IconButton sx={{
                            fontSize: "2rem", width: "2.5rem", height: "2.5rem", position: "absolute",
                            ...(blockType === "rightBlock") ? { left: 0 } : { right: 0 },
                            opacity: (isCurrentRow && !Boolean(currentBlockText) && (blockType !== "imageBlock") && (blockType !== "voteBlock")) ? 1 : 0,
                            transform: (isCurrentRow && !Boolean(currentBlockText) && (blockType !== "imageBlock") && (blockType !== "voteBlock"))
                                ? `scale(1) translateX(${blockType === "rightBlock" ? "100%" : "-100%"})`
                                : `scale(0)`,
                            transition: "opacity, 300ms",
                            ...hasVoteBlock && { transform: "scale(0)" }



                        }}
                            size="small"

                            contentEditable={false} suppressContentEditableWarning={true}
                            onClick={function () {

                                markingVoteBlock(blockKey)
                            }}
                        >
                            <StackedBarChart fontSize="large" sx={{ transform: "rotate(90deg) scaleX(-1)" }} />
                        </IconButton>


                        {block}
                    </Box>
                )

            })}

        </>



    )

}



