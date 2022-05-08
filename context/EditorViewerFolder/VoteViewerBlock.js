import React, { useState, useRef, useEffect, memo } from "react";
import { Button, CssBaseline, Switch, Paper, IconButton, Popover, Typography, Slide, Tabs, Tab, AppBar, Stack, Box, Divider, LinearProgress } from '@mui/material';
import { ThemeProvider, useTheme, createTheme, styled, } from '@mui/material/styles';
import Countdown from "react-countdown";
import { blue, red, grey } from '@mui/material/colors';
import { IndeterminateCheckBox } from "@mui/icons-material";

export default function VoteViewerBlock({ topic, duration, voteArr, expireDate }) {

    //console.log(topic, duration, voteArr)

    const theme = useTheme()



    const [expireTime, setExpireTime] = useState("")

    const [isVotting, setIsVotting] = useState((Date.parse(new Date(expireDate)) - Date.now()) > 0)



    const [voteCountArr, setVoteCountArr] = useState(voteArr.map(item => {


        return Number(Number(Math.random() * 100).toFixed(0))
    }))
    const totalVotes = voteCountArr.reduce((totalVotes_, itemVote) => {

        //console.log(voteCountArr, itemVote)
        return totalVotes_ + itemVote
    }, 0)

    const percentageArr = voteCountArr.map(count => {

        if (count === 0) { return 0 }
        else {
            return Number(Number(count / totalVotes * 100).toFixed(0))
        }

    })

    //const [totalVotes, setTotalVotes] = useState(0)


    // useEffect(function () {
    //     console.log(voteCountArr, percentageArr, totalVotes)

    // }, [])



    // useEffect(function () {

    //     setIsVotting((Date.parse(new Date(expireDate)) - Date.now()) > 0)


    // })

    return (
        <Box>
            {topic && <Typography variant='body2' sx={{ textAlign: "center" }} >{topic}</Typography>}

            {voteArr.map((choice, index) => {

                return (
                    <Box key={index} sx={{
                        position: "relative",


                        ...isVotting && {
                            "& > span": { bgcolor: theme.palette.action.disabledBackground },
                            "& > span > span": {

                                //bgcolor: hexToRGB(avatarColor, 0.5),
                                //  transition: "all, 300ms",
                                //  opacity:0.6,
                            },
                            "&:hover": {
                                cursor: "pointer", transition: "all, 300ms",
                                "& > span": { bgcolor: theme.palette.action.disabled },
                                "& > span > span": {

                                    //  bgcolor: hexToRGB(avatarColor, 1),
                                    //    transition: "all, 300ms",
                                    //    opacity:1,
                                },
                            }
                        },

                        ...!isVotting && {
                            "& > span": { bgcolor: theme.palette.action.disabledBackground },
                            "& > span > span": {

                                // hexToRGB(avatarColor, 0.5), transition: "all, 300ms"
                            },
                        }


                    }}>
                        <Typography variant='body2'
                            alt="sdfsddf"
                            sx={{
                                position: "absolute", top: "50%", left: 4, zIndex: 100, transform: "translateY(-50%)", display: "block", width: "calc(100% - 64px )",
                                //bgcolor: "yellow", 
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>
                            {(choice.length >= 25 ? choice.substring(0, 25) : choice)}
                        </Typography>

                        <LinearProgress variant="determinate"// value={percentageArr.length === 0 ? 0 : percentageArr[index]}  
                            //value={Math.min(100, index * 15 + 20)}             //value={Number(Math.random() * 100).toFixed(0)}
                            value={percentageArr[index]}
                            sx={{
                                height: theme.scaleSizeObj(1.5), marginBottom: "2px",
                            }}
                        />





                        <Typography variant='body2' sx={{ position: "absolute", top: "50%", right: 4, zIndex: 100, transform: "translateY(-50%)" }}>
                            {voteCountArr[index]}/{totalVotes}={percentageArr[index]}%
                            {/* {percentageArr.length === 0 ? "47%" : percentageArr[index] + "%"} */}
                        </Typography>

                    </Box>
                )

            })}
            {/* <Typography variant='body2' sx={{}}>
                {totalVotes} Votes
            </Typography> */}

            <Countdown date={Date.parse(new Date(expireDate))} intervalDelay={1 * 1000}
                renderer={function ({ days, hours, minutes, seconds, completed, ...props }) {
                    return <TimeRender  {...{ days, hours, minutes, seconds, completed, expireTime, totalVotes, ...props }} />
                }}

                onComplete={function () {
                    setIsVotting(false)
                }}
                overtime={true}

            />

        </Box>
    )

}









function TimeRender({ days, hours, minutes, seconds, completed, expireTime, totalVotes, ...props }) {

    const theme = useTheme()



    const message = completed
        //  ? `Finished on ${format(Date.parse(expireTime), "yyyy-MM-dd hh:mm")}`
        ? days > 0
            ? `Closed ${days} days ago`
            : hours > 0
                ? `Closed ${hours} hours ago`
                : minutes > 0
                    ? `Closed ${minutes} min ago`
                    : `Closed ${seconds} sec ago`
        : days > 0
            ? `${days}+ days Left`
            : hours > 0
                ? `${hours}+ hours Left`
                : minutes > 0
                    ? `${minutes}+ min Left`
                    : `${seconds} sec Left`

    return <Box sx={{ display: "flex", justifyContent: "space-between", paddingLeft: "4px", paddingRight: "4px" }}>
        <Typography variant='body2' className="count-down" sx={{ color: theme.palette.text.secondary }}>{message} </Typography>
        <Typography variant='body2' className="count-down" sx={{ color: theme.palette.text.secondary }}>Total {totalVotes} </Typography>
        {/* <Typography variant='body2' className="count-down" sx={{ color: theme.palette.text.secondary }}>{days} {hours} {minutes} {seconds}</Typography>
      <Typography variant='body2' className="count-down">{intervalDelay}</Typography> */}
    </Box>
}
