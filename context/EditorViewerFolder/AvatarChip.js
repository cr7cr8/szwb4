import { useContext, useEffect, useState, useRef } from 'react';


import { Container, Grid, Paper, Typography, Box, Avatar, Chip } from '@mui/material';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import multiavatar from '@multiavatar/multiavatar';
import { blue, red, grey } from '@mui/material/colors';



export default function AvatarChip({ personName, children,
    downloadAvatarUrl = "", avatarPeopleList = [], genAvatarLink = () => { }
}) {


    const theme = useTheme()
    const colorObj = theme.colorObj
    const colorBgObj = theme.colorBgObj


    const backgroundImage = avatarPeopleList.includes(personName)
        ? `url(${genAvatarLink(downloadAvatarUrl, personName)})`
        : `url(${"data:image/svg+xml;base64," + btoa(multiavatar(personName))})`


    return (

        <Box //contentEditable={false} suppressContentEditableWarning={true}
            sx={{

                display: "inline-flex",
                verticalAlign: "text-top",
                //verticalAlign: blockData.isSmallFont ? "text-top" : "top",
                lineHeight: 1,
                bgcolor: colorBgObj,
                alignItems: "center",
                padding: "4px",
                color: theme.isLight ? colorObj[500] : colorObj[300],
                padding: "4px",
                paddingRight: "12px",
                // paddingRight: theme.scaleSizeObj(blockData.isSmallFont ? 0.4 : 0.5),
                borderRadius: "1000px",


                borderStyle: "solid",
                borderWidth: "1px",
                borderColor: "transparent",
                //boxSizing: "border-box",
                transition: "all 200ms ease",

                "&::before": {
                    content: `""`,
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
                    display: "inline-block",
                    marginRight: "7px",

                },
                "&:hover": {
                    //  bgcolor: theme.palette.action.hover,
                    bgcolor: "transparent",
                    cursor: "pointer",
                    borderColor: theme.isLight ? colorObj[500] : colorObj[300],

                },
                "& > *": {
                    transform: "translateY(-2px)"
                }
            }}
        >
            {children}
        </Box>

    )






}

/*

export default function AvatarChip({ personName, labelDom, downloadAvatarUrl = "", children }) {

    let avatarString = multiavatar(personName)
    avatarString = "data:image/svg+xml;base64," + btoa(avatarString)
    const theme = useTheme()
    const colorObj = theme.colorObj
    const colorBgObj = theme.colorBgObj




    return (
        <Chip
            variant="filled"
            sx={{
                justifyContent: "flex-start",
                //   zIndex: 1000,

                //fontSize:theme.sizeObj,
                // ...inTab === index && { bgcolor: "pink" }

                // bgcolor: "background.default",
                // borderWidth: "1px",
                // borderStyle: "solid",
                // borderColor: theme.isLight ? colorObj[500] : colorObj[300],
                color: theme.isLight ? colorObj[500] : colorObj[300],
                bgcolor: colorBgObj,


            }}

            clickable={true}

            avatar={
                <Avatar alt={personName}

                    // {...{ src: downloadAvatarUrl ? downloadAvatarUrl + "/" + personName.length*80 : avatarString }}

                    {...{ src: avatarString }}
                    sx={{
                        "&.MuiAvatar-root.MuiChip-avatar": {
                            width: theme.scaleSizeObj(1),
                            height: theme.scaleSizeObj(1),
                            transform: "scale(1.1)",
                            //marginLeft: "1px",
                            // marginRight: "-8px",
                        }


                    }}
                />}
            label={labelDom}

        />

    )



}

*/