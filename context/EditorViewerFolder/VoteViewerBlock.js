import React, { useState, useRef, useEffect, memo } from "react";
import { Button, CssBaseline, Switch, Paper, IconButton, Popover, Typography, Slide, Tabs, Tab, AppBar, Stack, Box, Divider, LinearProgress } from '@mui/material';
import { ThemeProvider, useTheme, createTheme, styled, } from '@mui/material/styles';
import Countdown from "react-countdown";
import { blue, red, grey } from '@mui/material/colors';
import { IndeterminateCheckBox } from "@mui/icons-material";
import axios from "axios";


export default function VoteViewerBlock({ topic, duration, voteArr, voteId, expireDate, downloadVoteUrl }) {



    const theme = useTheme()
    const colorObj = theme.colorObj




    const [expireTime, setExpireTime] = useState("")

    const [isVotting, setIsVotting] = useState((Date.parse(new Date(expireDate)) - Date.now()) > 0)

    const [isLoaded, setIsLoaded] = useState(false)

    const [voteCountArr, setVoteCountArr] = useState(
        voteArr.map(item => {
            return 0
            //return Number(Number(Math.random() * 100).toFixed(0))
        })
    )
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

    useEffect(function () {
        if (Number.isNaN(totalVotes) || percentageArr.length !== voteArr.length) {
            setVoteCountArr(pre => {
                return new Array(voteArr.length).fill(0)
            })
        }
    })

    useEffect(function () {

        downloadVoteUrl && axios.get(`/api/voteBlock/getVoteCount/${voteId}`).then(response => {


            if (response.data?.voteCountArr) {

                setVoteCountArr(response.data?.voteCountArr)
                setIsLoaded(true)
            }

        })

    }, [])




    return (
        <Box>
            {topic && <Typography variant='body2' sx={{ textAlign: "center" }} >{topic}</Typography>}

            {voteArr.map((choice, index) => {

                return (
                    <Box key={index}
                        sx={{
                            position: "relative",


                            ...isVotting && {
                                "& > span": {

                                    // bgcolor: theme.palette.action.disabledBackground,
                                    bgcolor: "transparent",
                                    borderWidth: "2px",
                                    borderStyle: "solid",
                                    borderColor: theme.isLight ? colorObj[300] === "#e0e0e0" ? "darkgray" : colorObj[300] : colorObj[600]

                                },

                                "& > span > span": {
                                    bgcolor: theme.isLight ? colorObj[300] === "#e0e0e0" ? "darkgray" : colorObj[300] : colorObj[600]
                                    //bgcolor: hexToRGB(avatarColor, 0.5),
                                    //  transition: "all, 300ms",
                                    //  opacity:0.6,
                                },
                                ...(isLoaded || (!downloadVoteUrl)) && {
                                    "&:hover": {
                                        cursor: "pointer", transition: "all, 300ms",
                                        "& > span": { bgcolor: theme.palette.action.disabledBackground },
                                        "& > span > span": {

                                            //  bgcolor: hexToRGB(avatarColor, 1),
                                            //    transition: "all, 300ms",
                                            //    opacity:1,
                                        }
                                    },
                                }
                            },

                            ...!isVotting && {
                                "& > span": {
                                    bgcolor: theme.palette.action.disabledBackground
                                    //bgcolor:"transparent"
                                },
                                "& > span > span": {
                                    bgcolor: theme.isLight ? colorObj[300] === "#e0e0e0" ? "darkgray" : colorObj[300] : colorObj[600]
                                    // hexToRGB(avatarColor, 0.5), transition: "all, 300ms"

                                },
                            }


                        }}
                        onClick={function () {



                            if (isVotting && downloadVoteUrl && isLoaded) {
                                setVoteCountArr((pre) => {
                                    const newCountArr = [...pre]
                                    newCountArr[index] = newCountArr[index] + 1
                                    console.log(newCountArr)
                                    return newCountArr
                                })
                                setIsVotting(false)
                                axios.put(`/api/voteBlock/updateVoteCount/${voteId}/${index}`).then(resposne => {

                                })
                            }

                            else if (isVotting && !downloadVoteUrl) {
                                setVoteCountArr((pre) => {

                                    const newCountArr = [...pre]
                                    newCountArr[index] = newCountArr[index] + 1
                                    //console.log(newCountArr)
                                    return newCountArr
                                })

                            }
                        }}
                    >
                        <Typography variant='body2'
                            alt="sdfsddf"
                            sx={{
                                position: "absolute",

                                left: 4,
                                zIndex: 20,

                                display: "block",
                                width: "calc(100% - 64px )",
                                //bgcolor: "yellow", 
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                top: 0,

                                // transform: "translateY(-50%)",
                            }}>
                            {(choice.length >= 25 ? choice.substring(0, 25) : choice)}
                        </Typography>

                        <LinearProgress variant="determinate"// value={percentageArr.length === 0 ? 0 : percentageArr[index]}  
                            //value={Math.min(100, index * 15 + 20)}             //value={Number(Math.random() * 100).toFixed(0)}
                            value={percentageArr[index] || 0}
                            sx={{
                                height: theme.scaleSizeObj(1.5), marginBottom: "2px",
                            }}
                        />

                        <Typography variant='body2' sx={{
                            display: "block",
                            position: "absolute",
                            right: 4, zIndex: 20,
                            top: 0,
                            //    transform: "translateY(-50%)",

                        }}>
                            {/* {voteCountArr[index]}/{totalVotes}={percentageArr[index]}% */}
                            {percentageArr[index]}%
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
        <Typography className="count-down" sx={{ color: theme.palette.text.secondary }}>{message} </Typography>
        <Typography className="count-down" sx={{ color: theme.palette.text.secondary }}>Total {totalVotes} </Typography>
        {/* <Typography variant='body2' className="count-down" sx={{ color: theme.palette.text.secondary }}>{days} {hours} {minutes} {seconds}</Typography>
      <Typography variant='body2' className="count-down">{intervalDelay}</Typography> */}
    </Box>
}
