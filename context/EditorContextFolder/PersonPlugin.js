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
        const colorObj = theme.colorObj
        const colorBgObj = theme.colorBgObj

        const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, children, } = props;
        const blockData = contentState.getBlockForKey(blockKey).getData().toObject()

        const { peopleList, avatarPeopleList, downloadAvatarUrl, genAvatarLink } = useContext(EditorContext)
        const backgroundImage = avatarPeopleList.includes(decoratedText)
            ? `url(${genAvatarLink(downloadAvatarUrl, decoratedText)})` //genAvatarLink(downloadAvatarUrl, decoratedText)
            : `url(${"data:image/svg+xml;base64," + btoa(multiavatar(decoratedText))})`

        const cssObj = {

            display: "inline-block",
            "& span": {
                fontSize: theme.scaleSizeObj(blockData.isSmallFont ? 0.8 : 1),
                wordWrap: "normal",
                transition: "font-size, 300ms",
                //   fontSize:     blockData.isSmallFont ? "1rem" : "1.5rem",
            },

        }

        return (

            <AvatarChip personName={decoratedText} avatarPeopleList={avatarPeopleList}
                downloadAvatarUrl={downloadAvatarUrl} genAvatarLink={genAvatarLink}
            >
                {children}
            </AvatarChip>
        )

        return (

            <Box //contentEditable={false} suppressContentEditableWarning={true}
                sx={{


                    display: "inline-flex",
                    //  verticalAlign: blockData.isSmallFont ? "text-top" : "top",
                    lineHeight: 1,
                    bgcolor: colorBgObj,
                    alignItems: "center",
                    padding: "4px",
                    color: theme.isLight ? colorObj[500] : colorObj[300],
                    padding: "5px",
                    paddingRight: "12px",
                    // paddingRight: theme.scaleSizeObj(blockData.isSmallFont ? 0.4 : 0.5),
                    borderRadius: "1000px",
                    "&::before": {
                        content: `" "`,
                        backgroundImage,
                        backgroundSize: "contain",
                        // paddingLeft: theme.scaleSizeObj(blockData.isSmallFont ? 1.2 : 1.2),
                        // paddingRight: theme.scaleSizeObj(blockData.isSmallFont ? 0.4 : 0.5),
                        width: theme.scaleSizeObj(1),
                        height: theme.scaleSizeObj(1),
                        transform: "scale(1.2)",
                        borderRadius: "1000px",
                        backgroundRepeat: "no-repeat",
                        overflow: "hidden",
                        //   backgroundSize: theme.sizeObj,
                        backgroundPositionX: "left",
                        backgroundPositionY: "center",
                        bgcolor: "pink",
                        display: "inline-block",
                        marginRight: "7px"
                    }

                }}
            >

                <span>{children}</span>


            </Box>

        )

        return (
            <Box sx={{
                padding: "4px",

                // ...theme.isDark && {
                //     borderWidth: "1px",
                //     borderStyle: "solid",
                //     borderColor: theme.isLight ? colorObj[500] : colorObj[300],
                // },

                //  ...theme.isLight && {
                bgcolor: colorBgObj,
                //   },

                color: theme.isLight ? colorObj[500] : colorObj[300],

                borderRadius: "1000px",

                verticalAlign: "sub",

                display: "inline-block",


            }}>
                <Box //contentEditable={false} suppressContentEditableWarning={true}
                    sx={{

                        // borderWidth: "1px",
                        // borderStyle: "solid",
                        // borderColor: theme.isLight?colorObj[500]:colorObj[300],




                        // verticalAlign: "sub",
                        // backgroundImage: `url(${"data:image/svg+xml;base64," + btoa(multiavatar(decoratedText))})`,
                        // backgroundSize: theme.sizeObj,
                        // height: theme.scaleSizeObj(blockData.isSmallFont ? 0.8 : 1), // for smallFont
                        ////
                        backgroundImage,
                        backgroundSize: "contain",
                        paddingLeft: theme.scaleSizeObj(blockData.isSmallFont ? 1.2 : 1.2),
                        paddingRight: theme.scaleSizeObj(blockData.isSmallFont ? 0.4 : 0.5),
                        borderRadius: "1000px",
                        backgroundRepeat: "no-repeat",
                        overflow: "hidden",

                        backgroundPositionX: "left",
                        backgroundPositionY: "center",


                        height: theme.sizeObj,
                        "& p": {
                            verticalAlign: blockData.isSmallFont ? "text-top" : "top",
                            lineHeight: 1,
                        },
                        // "&::before": {
                        //     content: `""`,
                        //     backgroundImage,
                        //     backgroundSize: "contain",
                        //     paddingLeft: theme.scaleSizeObj(blockData.isSmallFont ? 1.2 : 1.2),
                        //     paddingRight: theme.scaleSizeObj(blockData.isSmallFont ? 0.4 : 0.5),
                        //     borderRadius: "1000px",
                        //     backgroundRepeat: "no-repeat",
                        //     overflow:"hidden",
                        //     //   backgroundSize: theme.sizeObj,
                        //     backgroundPositionX: "left",
                        //     backgroundPositionY: "center",
                        // }

                    }}
                >

                    <Typography sx={cssObj}>
                        {children}
                    </Typography>
                </Box>
            </Box>
        )

    }

    function Person_({ ...props }) {

        const theme = useTheme()
        //   const { userName, clickFn, userAvatarUrl, setUserAvatarUrl, avatarNameArr, userColor, userInfoArr, random } = useContext(EditorContext)


        const { contentState, entityKey, blockKey, offsetKey, start, end, decoratedText, children, } = props;
        const { mentionHeadKey, mentionBodyKey, person, imgurl, mentionType } = contentState.getEntity(entityKey).getData()

        const blockData = contentState.getBlockForKey(blockKey).getData().toObject()

        const backgroundImage = userName === decoratedText
            ? `url(${userAvatarUrl})`
            : avatarNameArr.includes(decoratedText)
                ? `url(${url}/api/user/downloadAvatar/${decoratedText}/${random})`
                : `url(${"data:image/svg+xml;base64," + btoa(multiavatar(decoratedText))})`


        const cssObj = {
            // backgroundColor: theme.palette.mode === "light"
            //   ? hexify(hexToRgbA(multiavatar(decoratedText).match(/#[a-zA-z0-9]*/)[0]))
            //   : hexify(hexToRgbA2(multiavatar(decoratedText).match(/#[a-zA-z0-9]*/)[0])),//       "gold",
            display: "inline-block",
            "& span": {

                fontSize: theme.scaleSizeObj(blockData.isSmallFont ? 0.8 : 1),

                wordWrap: "normal",
                transition: "font-size, 300ms"
            },

        }

        const name = decoratedText
        const avatarString = multiavatar(name)
        let avatarColor = ""
        let colorItem = ""

        if (!userColor && (userName === name)) {

            let colorItem = avatarString.match(/#[a-zA-z0-9]*/)[0]
            if (colorItem.length < 7) {
                colorItem = "#" + colorItem[1] + colorItem[1] + colorItem[2] + colorItem[2] + colorItem[3] + colorItem[3]
            }
            avatarColor = theme.isLight ? hexToRGB(colorItem, 0.4) : hexToRGB2(colorItem, 0.6)
        }
        else if (userColor && (userName === name)) {
            const colorItem = colorArr[colorIndexArr.findIndex(item => item === userColor)]
            avatarColor = theme.isLight ? colorItem[200] : colorItem[800]
        }
        else if (userName !== name) {

            const colorName = userInfoArr.find(userItem => userItem.userName === name)?.colorName
            let colorItem = ""
            if (colorName) {
                colorItem = colorArr[colorIndexArr.findIndex(item => item === colorName)]
                avatarColor = theme.isLight ? colorItem[200] : colorItem[800]
            }
            else {
                let colorItem = avatarString.match(/#[a-zA-z0-9]*/)[0]
                if (colorItem.length < 7) {
                    colorItem = "#" + colorItem[1] + colorItem[1] + colorItem[2] + colorItem[2] + colorItem[3] + colorItem[3]
                }
                avatarColor = theme.isLight ? hexToRGB(colorItem, 0.4) : hexToRGB2(colorItem, 0.6)
            }
        }



        return (

            <Box //contentEditable={false} suppressContentEditableWarning={true}
                sx={{
                    // bgcolor: theme.palette.mode === "light"
                    //   ? hexify(hexToRgbA(multiavatar(decoratedText).match(/#[a-zA-z0-9]*/)[0]))
                    //   : hexify(hexToRgbA2(multiavatar(decoratedText).match(/#[a-zA-z0-9]*/)[0])),


                    bgcolor: avatarColor,
                    verticalAlign: "sub",
                    backgroundImage,
                    // backgroundImage: `url(${"data:image/svg+xml;base64," + btoa(multiavatar(decoratedText))})`,
                    backgroundSize: "contain",
                    paddingLeft: theme.scaleSizeObj(blockData.isSmallFont ? 1 : 1.2),
                    paddingRight: theme.scaleSizeObj(blockData.isSmallFont ? 0.4 : 0.5),
                    borderRadius: "1000px",
                    backgroundRepeat: "no-repeat",
                    display: "inline-block",
                    //   backgroundSize: theme.sizeObj,
                    backgroundPositionX: "left",
                    backgroundPositionY: "center",
                    height: theme.scaleSizeObj(blockData.isSmallFont ? 0.8 : 1),
                    "& p": {
                        verticalAlign: "top",
                        lineHeight: 1,
                    },
                    transition: "height, padding-left, padding-right, 300ms",
                }}
            >

                <Typography sx={cssObj} variant="body2">
                    {children}
                </Typography>
            </Box>


        )





        return <Typography sx={cssObj} variant="body2">
            {children}
        </Typography>

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