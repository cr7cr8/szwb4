import React, { useState, useRef, useEffect } from "react";
import { Button, CssBaseline, Switch, Paper, IconButton, Popover, Typography, Slide, Tabs, Tab, AppBar, Stack, Box, Divider,LinearProgress } from '@mui/material';
import { ThemeProvider, useTheme, createTheme, styled, } from '@mui/material/styles';


export default function VoteViewerBlock({ topic, duration, voteArr }) {

    //console.log(topic, duration, voteArr)

    const theme = useTheme()

    return (
        <Box>
            {topic && <Typography variant='body2' sx={{ textAlign: "center" }} >{topic}</Typography>}

            {voteArr.map((choice, index) => {

                return (
                    <Box key={index} sx={{ position: "relative", }}>
                        {choice}

                        <LinearProgress variant="determinate"// value={percentageArr.length === 0 ? 0 : percentageArr[index]}  
                         value={Math.min(100, index * 15 + 20)}             //value={Number(Math.random() * 100).toFixed(0)}
                            sx={{
                                height: theme.scaleSizeObj(1.5), marginBottom: "2px",
                            }}
                        />

                    </Box>
                )

            })}

        </Box>
    )

}