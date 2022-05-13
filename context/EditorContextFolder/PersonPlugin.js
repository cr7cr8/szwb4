import { useContext, useEffect, useState, useRef } from 'react';

import { Container, Grid, Paper, Typography, Box, Avatar } from '@mui/material';


import multiavatar from '@multiavatar/multiavatar';
import { useTheme } from '@mui/private-theming';

import { EditorContext } from "../EditorContextProvider";
import { blue, red, grey } from '@mui/material/colors';
import AvatarChip from '../EditorViewerFolder/AvatarChip';

export default function createPersonPlugin() {

    function personStrategy(contentBlock, callback, contentState) {

        contentBlock.findEntityRanges(
            function (character) {
                const entityKey = character.getEntity();
                return entityKey !== null && contentState.getEntity(entityKey).getType().indexOf("personTag") >= 0
            },
            callback
        );
    }


    function Person({ ...props }) {
        const theme = useTheme()
     
        const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, children, } = props;
        const blockData = contentState.getBlockForKey(blockKey).getData().toObject()

        const { peopleList, avatarPeopleList, downloadAvatarUrl, genAvatarLink } = useContext(EditorContext)
     

        return (

            <AvatarChip personName={decoratedText} avatarPeopleList={avatarPeopleList}
                downloadAvatarUrl={downloadAvatarUrl} genAvatarLink={genAvatarLink}
            >
                {children}
            </AvatarChip>
        )

    


    }


    return {

        personPlugin: {

            decorators: [
                {
                    strategy: personStrategy,
                    component: Person,
                }
            ],

        }
    }

}