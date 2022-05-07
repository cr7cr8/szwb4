import React, { useState, createContext, useMemo, useId, useDeferredValue, useCallback } from "react"

import {
    EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
    RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';

import DraftEditor from "./EditorContextFolder/DraftEditor"
import parse, { domToReact, attributesToProps } from 'html-react-parser';


import ImageViewerBlock from "./EditorViewerFolder/ImageViewerBlock";


export const EditorContext = createContext()

export function EditorContextProvider({

    onChange,
    onLocalSubmit,
    onRemoteSubmit,

}) {

    const key1 = useId().replace(":", "").replace(":", "")
    const rawJsText = useMemo(() => {

        return {
            "entityMap": {},
            "blocks": [
                {
                    "key": key1,
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


    const [editorState, setEditorState] = useState(EditorState.createWithContent(convertFromRaw(rawJsText)) || EditorState.createEmpty())

    const [currentBlockKey, setCurrentBlockKey] = useState("ddd")

    const [imageObj, setImageObj] = useState({})
    const imageBlockNum = editorState.getCurrentContent().getBlocksAsArray().filter(block => block.getType() === "imageBlock").length

    const [peopleList, setPeopleList] = useState(["UweF23", "UweF22", "TonyCerl", "JimWil", "大发发", "Jimberg", "m大Gsd哈"])

    const [voteArr, setVoteArr] = useState([])
    const [voteTopic, setVoteTopic] = useState("")
    const [pollDuration, setPollDuration] = useState({ d: 3, h: 0, m: 0 })

    const clearState = useCallback(function () {

        setEditorState(EditorState.createEmpty())
        setImageObj({})
        setVoteArr([])
        setVoteTopic("")

    }, [])



    return (

        <EditorContext.Provider value={{

            editorState, setEditorState,
            currentBlockKey, setCurrentBlockKey,

            // savedImageObj, setSavedImageObj,
            imageObj, setImageObj,
            imageBlockNum,
            peopleList, setPeopleList,

            voteArr, setVoteArr,
            voteTopic, setVoteTopic,
            pollDuration, setPollDuration,

            onChange,
            onLocalSubmit,
            onRemoteSubmit,

            clearState

        }}>
            <DraftEditor />
        </EditorContext.Provider>
    )
}

export function EditorViewer({ preHtml }) {

    const options = useMemo(() => ({
        replace: (domNode) => {
            const { name, type, attribs, children } = domNode



            if (name === "object" && attribs["data-type"] === "image-block") {


                const imgSnapArr = []
                const imgUrlArr = []

                children.forEach((item, index) => {
                    imgSnapArr.push(item.attribs["data-imgsnap"])
                    imgUrlArr.push(item.attribs["data-imgurl"])
                })

                return <ImageViewerBlock {...{ imgSnapArr, imgUrlArr }} />

                return <div>{children.map((item, index) => {
                    return <img key={index} src={item.attribs["data-imgsnap"]} style={{ width: 100, height: 100 }} />
                })}</div>
            }
            else if (name === "object" && attribs["data-type"] === "vote-block") {


                const topic = children?.[0]?.children?.[0]?.data ?? ""
                const duration = children?.[1]?.children?.[0]?.data
                const voteArr = children.slice(2).map(item => {
                    return item?.children?.[0]?.data ?? ""
                })

                console.log(topic)
                console.log(duration)
                console.log(voteArr)

                return <span>{topic}</span>

            }



        }
    }), [preHtml])



    return parse(preHtml, options)


}