

import { useContext, useState, useRef, useEffect } from 'react';
import { EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw, RichUtils, Modifier, convertFromHTML, AtomicBlockUtils } from 'draft-js';
import { Container, Grid, Paper, Typography, Box, Popover, Popper } from '@mui/material';


import { EditorContext } from "../EditorContextProvider";





export default function createMentionPlugin({ ...props }) {

    let editorState = null
    let setEditorState = null
    let newContent = null
    const entityKeyObj = {}
  
    let tagStartPos = 0
    let tagEndPos = 0
  
  
    let tabIndex = 1006;
    let isShowing = false;
  
    let tabName = ""



    return {


        mentionPlugin: {

          
        },

    }

}