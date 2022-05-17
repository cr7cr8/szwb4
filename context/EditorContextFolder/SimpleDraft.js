
import React, { useState, useRef, useEffect, useLayoutEffect, useContext, useCallback, createContext, useMemo, useId } from 'react';
import { stateToHTML } from 'draft-js-export-html';
import {
  EditorState, ContentState, ContentBlock, CharacterMetadata, SelectionState, convertToRaw, convertFromRaw,
  RichUtils, Modifier, convertFromHTML, AtomicBlockUtils, getDefaultKeyBinding, KeyBindingUtil
} from 'draft-js';


import NoSsr from '@mui/material/NoSsr';

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
import createImagePlugin from './ImagePlugin';
import createLinkPlugin from './LinkPlugin';
import createMentionPlugin from './MentionPlugin';
import createPersonPlugin from './PersonPlugin';
import createVotePlugin from './VotePlugin';


const { emojiPlugin, EmojiComp } = createEmojiPlugin()
const { imagePlugin, markingImageBlock, ImageBlock } = createImagePlugin()
const { linkPlugin, taggingLink } = createLinkPlugin()
const { votePlugin, markingVoteBlock, VoteBlock } = createVotePlugin()

const { mentionPlugin, taggingMention, checkShowing } = createMentionPlugin()
const { personPlugin } = createPersonPlugin()
const { hasCommandModifier } = KeyBindingUtil;


import axios from "axios"



export default function SimpleDraft() {



    return (

        <></>


    )

}