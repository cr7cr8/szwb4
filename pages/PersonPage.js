

import React, { useContext } from "react"
import { Context, ContextProvider } from "../ContextProvider"

import { Button } from "@mui/material"
import Link from "next/link"
import { useRouter } from 'next/router';


export async function getServerSideProps(context) {

    console.log("===>>> req", context.req.dataObj)

    return {
        props: {},
    }
}

export default function PersonPage() {


    const { count, setCount } = useContext(Context)

    return (

        <>
            <Link href="/" ><h1>PersonPage {count}</h1></Link>
            <Button variant="contained" onClick={function () {
                setCount(pre => pre + 1)
            }}>add</Button>
        </>

    )
}





