import React, { useEffect, useState, useRef, useMemo, useContext, useCallback } from 'react';

import { ThemeProvider, useTheme, createTheme } from '@mui/material/styles';

import { Container, Grid, Paper, IconButton, ButtonGroup, Stack, Box, Button, Typography, Slider, } from '@mui/material';
import { EditorContext } from "../EditorContextProvider";
import Cropper from 'react-easy-crop';
import getCroppedImg from './cropImage';

import { Crop, DoneRounded, Close, AddCircleOutline } from '@mui/icons-material';



const arr = [
    [
        { gridColumn: "1/3", gridRow: "1/3" }
    ],
    [
        { gridColumn: "1/2", gridRow: "1/3" },
        { gridColumn: "2/3", gridRow: "1/3" },
    ],
    [
        // { gridColumn: "1/2", gridRow: "1/3" },
        // { gridColumn: "2/3", gridRow: "1/2" },
        // { gridColumn: "2/3", gridRow: "2/3" },
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

export default function ImageBlock({ ...props }) {

    const theme = useTheme()
    const colorObj = theme.colorObj

    const { imageObj, setImageObj, editorState, setEditorState } = useContext(EditorContext)
    const { blockKey, markingImageBlock } = props.blockProps
    const target = useRef()
    const [size, setSize] = useState()

    const inputRef = useRef()
    const numOfImage = Boolean(imageObj[blockKey]) ? imageObj[blockKey].length : 0





    const height = useMemo(function () {
        const width = size ? size.width : 0
        return [width / 16 * 9, width / 16 * 9, width / 2, width / 3, width / 16 * 9][numOfImage]
    }, [size, numOfImage])



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


    const imageHeight = size
        ? [{ height: 0 }, { height: size.width / 16 * 9 }, { height: size.width / 2 }, { height: size.width / 3 }, { height: size.width / 16 * 9 / 2 }][numOfImage]
        : { height: 0 }


    const cssObj = {
        display: 'grid',
        ...baseGrid,
        // gridTemplateColumns: "1fr 1fr",
        // gridTemplateRows: "1fr 1fr",
        gridGap: "2px",


        //   marginTop: "2px",
        //  marginBottom: "2px",
        justifyContent: 'space-around',
        overflow: 'hidden',

        width: "100%",
        height,


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




    useEffect(function () {
        const resizeObserver = new ResizeObserver(([element]) => {
            //console.log(element.contentRect.width)
            setSize(element.contentRect)

        })
        resizeObserver.observe(target.current)

        return function () { resizeObserver.disconnect() }
    }, [])


    function update(e) {
        e.preventDefault()
        e.stopPropagation()
        if (e.currentTarget.files[0].name.trim().match(/\.(gif|jpe?g|tiff|png|webp|bmp)$/i)) {

            const files = e.currentTarget.files
            //    console.log(URL.createObjectURL(files[0]))
            const newFileArr = [
                files[0] && URL.createObjectURL(files[0]),
                files[1] && URL.createObjectURL(files[1]),
                files[2] && URL.createObjectURL(files[2]),
                files[3] && URL.createObjectURL(files[3]),

            ]
                .filter(item => Boolean(item))
                .filter((item, index) => { return index < 4 })
                .map(file => {
                    return { imgId: Math.random(), imgUrl: file, imgSnap: file, isEditing: false }
                })

            setImageObj(pre => {
                const preBlock = pre[blockKey] ? pre[blockKey] : []

                return {
                    ...pre,
                    [blockKey]: [...preBlock, ...newFileArr],

                }
            })
        }
    }

  


    return (
        <>

            <input ref={inputRef} type="file" multiple={true} style={{ display: "none" }} accept="image/*"
                onClick={function (e) { e.currentTarget.value = null; }}
                onChange={update}
            />


            <Box sx={{ //backgroundColor: "wheat", 
                width: "100%", position: "relative",
                // bgcolor: theme.isLight
                //     ? `rgba( ${hexToRgb(colorObj[100]).r}, ${hexToRgb(colorObj[100]).g}, ${hexToRgb(colorObj[100]).b},   0.5)`
                //     : `rgba( ${hexToRgb(colorObj[900]).r}, ${hexToRgb(colorObj[900]).g}, ${hexToRgb(colorObj[900]).b},   0.5)`,

                // ...numOfImage === 0 && {
                //     backgroundColor: theme.palette.mode === "light" ? "lightgray" : "darkgray",
                // }
            }}>
                <Box contentEditable={false} sx={cssObj} ref={target} >

                    {numOfImage >= 1 && numOfImage < 4 && <IconButton sx={{
                        fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                        position: "absolute", right: 0, transform: "translateX(100%)",
                        zIndex: 80,
                    }}
                        size="small"
                        contentEditable={false} suppressContentEditableWarning={true}
                        onClick={function () {
                            if ((!imageObj[blockKey]) || imageObj[blockKey].length < 4) {
                                inputRef.current.click()
                            }
                        }}
                    >
                        <AddCircleOutline fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
                    </IconButton>
                    }

                    {numOfImage === 0 && <IconButton sx={{
                        fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                        position: "absolute", left: "50%", top: "50%", transform: "translateX(-50%) translateY(-50%) scale(3)",

                        zIndex: 80,
                    }}
                        size="small"
                        contentEditable={false} suppressContentEditableWarning={true}
                        onClick={function () {
                            if ((!imageObj[blockKey]) || imageObj[blockKey].length < 4) {
                                inputRef.current.click()
                            }
                        }}
                    >
                        <AddCircleOutline fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
                    </IconButton>
                    }


                    {numOfImage === 0 && <IconButton sx={{
                        fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                        position: "absolute", right: 0, // transform: "translateX(180%)",

                        zIndex: 80,
                    }}
                        size="small"
                        contentEditable={false} suppressContentEditableWarning={true}
                        onClick={function () {

                            markingImageBlock(blockKey, true)
                            setImageObj(pre => {

                                delete pre[blockKey]
                                return { ...pre }

                            })
                            // setTimeout(() => {
                            //   setEditorState(EditorState.forceSelection(editorState, editorState.getSelection()))
                            // }, 1000);


                        }}
                    >
                        <Close fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
                    </IconButton>
                    }





                    {Array.isArray(imageObj[blockKey]) && imageObj[blockKey].map((item, index) => {

                        return (

                            <React.Fragment key={index}>
                                <Box style={{
                                    // backgroundColor: "pink",
                                    width: "100%",
                                    ...imageHeight,
                                    display: "block",
                                    position: "relative"
                                }}
                                    key={index}
                                >
                                    {item.isEditing
                                        ? <ImageAdjuster
                                            imageUrl={item.imgUrl} imageSnap={item.imgSnap} imageId={item.imgId} image={item.imgSnap}

                                            blockKey={blockKey} numOfImage={numOfImage}
                                        />
                                        : <ImageSnap imageUrl={item.imgUrl} imageSnap={item.imgSnap} imageId={item.imgId} image={item.imgSnap}

                                            blockKey={blockKey}
                                            numOfImage={numOfImage}
                                        />
                                    }
                                </Box>
                            </React.Fragment>


                        )
                    })}





                </Box>
            </Box>
        </>

    )

}



function ImageSnap({ imageUrl, imageId, imageSnap, blockKey, numOfImage, ...props }) {

    const { imageObj, setImageObj } = useContext(EditorContext)

    function setIsEidting() {

        setImageObj(pre => {


            const arr = pre[blockKey].map(item => {
                if (item.imgId !== imageId) {
                    return item
                }
                else {
                    return { ...item, isEditing: true }
                }
            })

            return { ...pre, [blockKey]: arr }

        })
    }

    function closeImage() {

        setImageObj(pre => {
            const arr = pre[blockKey].filter(item => {
                return item.imgId !== imageId
            })
            return { ...pre, [blockKey]: arr }
        })

    }



    return (
        <>
            <IconButton sx={{
                fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                position: "absolute", left: 0,
                zIndex: 80,
                bgcolor: "rgba(255,255,255,0.3)"
            }}
                size="small"
                contentEditable={false} suppressContentEditableWarning={true}
                onClick={function () {
                    //   alert("Fdsf")
                    setIsEidting()
                    // showCroppedImage()
                }}
            >
                <Crop fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
            </IconButton>

            <IconButton sx={{
                fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                position: "absolute", right: 0,
                zIndex: 80,
                bgcolor: "rgba(255,255,255,0.3)"
            }}
                size="small"

                contentEditable={false} suppressContentEditableWarning={true}
                onClick={function () {
                    closeImage()
                }}

            >
                <Close fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
            </IconButton>




            <img src={imageSnap} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
        </>
    )

}


function ImageAdjuster({ imageUrl, imageId, imageSnap, blockKey, numOfImage, ...props }) {


    const { imageObj, setImageObj } = useContext(EditorContext)
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [rotation, setRotation] = useState(0)
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)


    const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const aspectArr = [1 / 1, 16 / 9, 1 / 1, 1 / 1, 16 / 9]



    async function setIsEidting() {

        const croppedImage = await getCroppedImg(
            // dogImg,
            imageUrl,
            croppedAreaPixels,
            rotation,
        )

        setImageObj(pre => {


            const arr = pre[blockKey].map(item => {
                if (item.imgId !== imageId) {
                    return item
                }
                else { return { ...item, isEditing: false, imgSnap: croppedImage } }


            })

            return { ...pre, [blockKey]: arr }

        })
    }

    function closeImage() {

        setImageObj(pre => {
            const arr = pre[blockKey].filter(item => {
                return item.imgId !== imageId
            })
            return { ...pre, [blockKey]: arr }
        })

    }



    return (

        <>

            <IconButton sx={{
                fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                position: "absolute", left: 0,
                zIndex: 80,
                bgcolor: "rgba(255,255,255,0.3)"
            }}
                size="small"

                contentEditable={false} suppressContentEditableWarning={true}
                onClick={function () {
                    setIsEidting()
                    // showCroppedImage()
                }}

            >

                <DoneRounded fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />



            </IconButton>

            <IconButton sx={{
                fontSize: "2rem", width: "2.5rem", height: "2.5rem",
                position: "absolute", right: 0,
                zIndex: 80,
                bgcolor: "rgba(255,255,255,0.3)"
            }}
                size="small"

                contentEditable={false} suppressContentEditableWarning={true}
                onClick={function () {
                    closeImage()
                }}

            >
                <Close fontSize="large" sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.5)", borderRadius: "1000px" } }} />
            </IconButton>

            <Cropper image={imageUrl}  //"https://img.huffingtonpost.com/asset/5ab4d4ac2000007d06eb2c56.jpeg?cache=sih0jwle4e&ops=1910_1000"
                aspect={aspectArr[numOfImage]}
                crop={crop}
                rotation={rotation}
                zoom={zoom}

                onCropChange={setCrop}
                onRotationChange={setRotation}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
            />

            {/* <Typography
        sx={{ position: "absolute", bottom: 0 }}
      // variant="overline"
      // classes={{ root: classes.sliderLabel }}
      >Zoom
      </Typography> */}
            <Slider
                size="medium"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                //  classes={{ root: classes.slider }}
                onChange={(e, zoom) => setZoom(zoom)}
                sx={{
                    //  padding: '22px 0px',
                    //  marginLeft: "",
                    marginLeft: "20px",
                    marginRight: "20px",
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    margin: "auto",
                    width: "90%",
                    color: "skyblue",

                }}
            />


        </>
    )

}




