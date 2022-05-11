import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';

function genRandom() {

  return "-" + (Math.random() * 10000).toFixed(0)
}

export default function createLinkPlugin() {

  let editorState = null
  let setEditorState = null
  let newContent = null
  const entityKeyObj = {}


  let tagStartPos = 0
  let tagEndPos = 0

  function conditionWrap({ editorState, searchAllBlock = true }) {
    return searchAllBlock
      ? editorState.getCurrentContent().getBlockMap()
      : [editorState.getCurrentContent().getBlockForKey(editorState.getSelection().getStartKey())]

  }

  function taggingLink() {
    const [anchorKey, anchorOffset, focusKey, focusOffset, isBackward, hasfocus] = editorState.getSelection().toArray()
    const [anchorStartKey, anchorStartOffset, anchorFocusKey, anchorFocusOffset, isAnchorBackward, isAnchorFocused]
      = [!isBackward ? anchorKey : focusKey, !isBackward ? anchorOffset : focusOffset, isBackward ? anchorKey : focusKey, isBackward ? anchorOffset : focusOffset,]
    const regx = /\s([a-zA-Z]{1,10}:\/\/)(([a-zA-Z0-9-_]+\.?)+(:\d{0,6})?)(\/[^\s\r\n\/]+){0,7}(\/)?/g

    const oldSelection = editorState.getSelection();
    let newContent = editorState.getCurrentContent();
    let newSelection = editorState.getSelection();

    conditionWrap({ editorState, searchAllBlock: true }).forEach(function (block) {

      const blockKey = block.getKey()
      const blockText = block.getText()
      const metaArr = block.getCharacterList()

      metaArr.forEach(function (item, index) {
        const styleArr = item.getStyle().toArray()


        if (styleArr && styleArr.length > 0) {
          if (styleArr.includes("linkTagOn") || styleArr.includes("linkTagOff")) {
            newSelection = newSelection.merge({
              anchorKey: blockKey,
              anchorOffset: index,
              focusKey: blockKey,
              focusOffset: index + 1,
              isBackward: false,
              hasFocus: false,
            })
            newContent = Modifier.removeInlineStyle(newContent, newSelection, "linkTagOn")
            newContent = Modifier.removeInlineStyle(newContent, newSelection, "linkTagOff")
          }
        }
      })

      let matchArr;
      while ((matchArr = regx.exec(blockText)) !== null) {

        const start = matchArr.index;
        const end = matchArr.index + matchArr[0].length;
        const contentLenth = end - start;
        const contentFocusAt = anchorFocusOffset - start;

        const mentionOn = hasfocus && (blockKey === anchorFocusKey) && (contentFocusAt > 0) && (contentFocusAt <= contentLenth)
        const mentionOff = !mentionOn

        if (mentionOn) {

          tagStartPos = start
          tagEndPos = end

          newSelection = newSelection.merge({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: start + 1,
            focusOffset: end,//  start + 2,
            isBackward: false,
            hasFocus: false,
          })
          newContent = Modifier.applyInlineStyle(newContent, newSelection, "linkTagOn")
        }
        else if (mentionOff) {
          tagStartPos = start
          tagEndPos = end

          newSelection = newSelection.merge({
            anchorKey: blockKey,
            focusKey: blockKey,
            anchorOffset: start + 1,
            focusOffset: end,//start + 2,
            isBackward: false,
            hasFocus: false,
          })
          newContent = Modifier.applyInlineStyle(newContent, newSelection, "linkTagOff")
        }
      }
    })

    editorState = EditorState.push(editorState, newContent, "change-inline-style");
    editorState = EditorState.acceptSelection(editorState, oldSelection);
    return editorState

  }




  return {


    linkPlugin: {

      onChange: function (newState, { setEditorState: setEditorState_ }) {
        //   alert("Ff")
        editorState = newState
        setEditorState = setEditorState_
        newContent = newState.getCurrentContent()

        editorState = taggingLink()
        return editorState
      },
    },
    taggingLink
  }


}