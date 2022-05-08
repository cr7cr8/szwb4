import React, { useState, useRef, useEffect } from "react";
import { Button, CssBaseline, Switch, Paper, IconButton, Popover, Typography, Slide, Tabs, Tab, AppBar, Stack, Box, Divider } from '@mui/material';
import { ThemeProvider, useTheme, createTheme, styled, } from '@mui/material/styles';
import Lightbox from 'react-image-lightbox';
import 'react-image-lightbox/style.css';




export default function ImageViewerBlock({ imgSnapArr, imgUrlArr }) {

    const theme = useTheme()
    const numOfImage = imgSnapArr.length

    const [width, setWidth] = useState(0)
    const height = [width / 16 * 9, width / 16 * 9, width / 2, width / 3, width / 16 * 9][numOfImage]
    const target = useRef()

    useEffect(function () {
        const resizeObserver = new ResizeObserver(([element]) => {
            //   console.log(element.contentRect.width)
            setWidth(element.contentRect.width)
        })
        resizeObserver.observe(target.current);
        return function () {
            resizeObserver.disconnect()
        }
    }, [])


    const baseGrid = [
        {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr",
        },
        {
            gridTemplateColumns: "1fr",
            gridTemplateRows: "1fr",
        },
        {
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr",
        },
        {
            gridTemplateColumns: "1fr 1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
        {
            gridTemplateColumns: "1fr 1fr",
            gridTemplateRows: "1fr 1fr",
        },
    ][numOfImage]

    const arr = [
        [
            { gridColumn: "1/3", gridRow: "1/3" }
        ],
        [
            { gridColumn: "1/2", gridRow: "1/3" },
            { gridColumn: "2/3", gridRow: "1/3" },
        ],
        [
            { gridColumn: "1/2", gridRow: "1/2" },
            { gridColumn: "2/3", gridRow: "1/2" },
            { gridColumn: "3/4", gridRow: "1/2" },

        ],
        [
            { gridColumn: "1/2", gridRow: "1/2" },
            { gridColumn: "2/3", gridRow: "1/2" },
            { gridColumn: "1/2", gridRow: "2/3" },
            { gridColumn: "2/3", gridRow: "2/3" },
        ]
    ]

    const imageHeight = width
        ? [{ height: 0 }, { height: width / 16 * 9 }, { height: width / 2 }, { height: width / 3 }, { height: width / 16 * 9 / 2 }][numOfImage]
        : { height: 0 }

    const cssObj = {
        display: 'grid',
        ...baseGrid,
        // gridTemplateColumns: "1fr 1fr",
        // gridTemplateRows: "1fr 1fr",
        gridGap: "2px",
        position: "relative",

        //   marginTop: "2px",
        //  marginBottom: "2px",
        justifyContent: 'space-around',
        overflow: 'hidden',

        width: "100%",
        height,
        // bgcolor: "pink",

        ...numOfImage > 0 && {
            "& > *:nth-type(1)": {
                position: "relative",
                ...arr[numOfImage - 1][0],
            }
        },
        ...numOfImage > 1 && {
            "& > *:nth-type(2)": {
                position: "relative",
                backgroundColor: "#ffa",
                ...arr[numOfImage - 1][1]
            }
        },
        ...numOfImage > 2 && {
            "& > *:nth-type(3)": {
                position: "relative",
                backgroundColor: "#afa",
                ...arr[numOfImage - 1][2]
            }
        },
        ...numOfImage > 3 && {
            "& > *:nth-type(4)": {
                position: "relative",
                backgroundColor: "#aaf",
                ...arr[numOfImage - 1][3]
            }
        },
        ...numOfImage > 4 && {
            "& > *:nth-type( n + 5 )": {
                display: "none",
            }
        },

    }

    const [isOpen, setIsOpen] = useState(false)
    const [photoIndex, setPhotoIndex] = useState(0)

    const images = imgUrlArr
    return (

        <Box sx={cssObj} ref={target}>
            {isOpen && <Lightbox
                mainSrc={images[photoIndex]}
                nextSrc={images[(photoIndex + 1) % images.length]}
                prevSrc={images[(photoIndex + images.length - 1) % images.length]}
                onCloseRequest={() => {
                    setIsOpen(false);
                }}
                onMovePrevRequest={() =>
                    setPhotoIndex(pre => (pre + images.length - 1) % images.length)
                }
                onMoveNextRequest={() =>
                    setPhotoIndex(pre => (pre + images.length + 1) % images.length)
                }
                onAfterOpen={() => {

                }}
            />}

            {imgSnapArr.map((item, index) => {
                return <Box key={index} sx={{
                    bgcolor: "pink",

                    width: "100%",
                    ...imageHeight,

                    position: "relative",


                }}
                    onClick={function () { setPhotoIndex(index); setIsOpen(true) }}
                >
                    <img src={item} style={{ width: "100%", height: "100%", verticalAlign: "bottom", objectFit: "cover", }} />
                </Box>
            })}

        </Box>
    )


}