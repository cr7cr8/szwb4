import { useContext, useEffect, useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import { EditorContext } from "../EditorContextProvider"

import multiavatar from '@multiavatar/multiavatar';
import { blue, red, grey } from '@mui/material/colors';



export default function MentionMenu({ tabIndex, setShowing, setTabName, nameList, insertMention, blockType, ...props }) {

    const inTab = tabIndex % nameList.length

    useEffect(function () {

        setShowing(true)

        return function () {
            setShowing(false)
        }

    }, [])

    const [right, setRight] = useState(false)
    const [opacity, setOpacity] = useState(0)
    const anchor = useRef()
    useEffect(function () {
        const { x, width } = anchor.current.getBoundingClientRect()
        if (x + width + 50 > window.innerWidth) {
            setRight(1)
        }
        setOpacity(1)
    }, [])




    return (

        <Stack direction="column" spacing={0.2} contentEditable={false} suppressContentEditableWarning={true}
            ref={anchor}
            sx={{
                width: "fit-content", position: "absolute",
                bgcolor: "transparent",

                zIndex: 500,
                opacity,
                ...Boolean(right) && { right: 0 },
                
            }}
        >

            {nameList.map((name, index) => {

                if (inTab === index) { setTabName(name) }

                let avatarString = multiavatar(name)
                avatarString = "data:image/svg+xml;base64," + btoa(avatarString)
                return (
                    <MentionMenuItem key={index} {...{ name, index, inTab, insertMention }} />
                )
            })}
        </Stack>
    )
}



export function MentionMenuItem({ name, index, inTab, insertMention }) {

    const theme = useTheme()
    const { peopleList, avatarPeopleList, downloadAvatarUrl, genAvatarLink } = useContext(EditorContext)

    const hasAvatar = avatarPeopleList.includes(name)

    const avatarString = hasAvatar
        ? genAvatarLink(downloadAvatarUrl, name)
        : "data:image/svg+xml;base64," + btoa(multiavatar(name))

    const colorObj = theme.colorObj
    const colorBgObj = theme.colorBgObj
    return (
        <Chip
            variant="filled"
            sx={{
                justifyContent: "flex-start",
                zIndex: 1000,
                backdropFilter: "blur(20px)",

                color: theme.palette.text.secondary,
                "&:hover": {

                    color: theme.isLight ? colorObj[500] : colorObj[300],
                    bgcolor: colorBgObj,
                },
                ...inTab === index && {
                
                    color: theme.isLight ? colorObj[500] : colorObj[300],
                    bgcolor: colorBgObj,
                }
            }}
            key={index}
            clickable={true}
            onMouseDown={function () { insertMention(name) }}
            avatar={
                <Avatar alt={name}

                    {...{ src: avatarString }}
                    sx={{
                        "&.MuiAvatar-root.MuiChip-avatar": {
                            width: theme.scaleSizeObj(1),
                            height: theme.scaleSizeObj(1),
                            transform: "scale(1.1)",
                
                        }
                    }}
                />}
            label={name}
        />
    )
}


// function ConditionalWrapper({ condition, wrapper, children }) {

//     return condition ? wrapper(children) : children;
// }

