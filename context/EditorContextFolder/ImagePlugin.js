import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';


import ImageBlock from "./ImageBlock"

export default function createImagePlugin() {

    let editorState = null
    let setEditorState = null
    let newContent = null


    function markingImageBlock(blockKey, isDeleting = false) {

        let newSelection = SelectionState.createEmpty(blockKey)
        newSelection = newSelection.merge({
            focusKey: blockKey,
            focusOffset: 0,
            anchorOffset: blockKey,
            anchorOffset: 0,
            hasFocus: false
        });

        const newContent = Modifier.setBlockType(
            editorState.getCurrentContent(),
            newSelection,
            isDeleting ? "unstyled" : "imageBlock"
        );

        editorState = EditorState.push(editorState, newContent, 'change-block-type');
        // EditorState.forceSelection(externalES, newSelection)
        if (isDeleting) {
            setTimeout(() => {
                setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()))
            }, 0);

        }
        else {
            //alert("cccaaa")
            // setTimeout(() => {
            //   //  alert("cccaaabbb")
            //     setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()))
            // }, 0);
            return setEditorState(editorState)
        }

    };

    return {

        imagePlugin: {

            onChange: function (newState, { setEditorState: setEditorState_ }) {
                editorState = newState
                setEditorState = setEditorState_
                newContent = newState.getCurrentContent()
                //  editorState = taggingEmoji()
                return editorState
            },
        },

        markingImageBlock,
        ImageBlock
    }

}