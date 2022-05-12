import { useContext, useEffect, useState, useRef } from 'react';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';
import multiavatar from '@multiavatar/multiavatar';
import { blue, red, grey } from '@mui/material/colors';



export default function AvatarChip({ personName, labelDom, isSmall = false }) {

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
                bgcolor:colorBgObj,


            }}

            clickable={true}

            avatar={
                <Avatar alt={personName}

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