import React, { useContext } from "react"
import { Context, ContextProvider } from "../ContextProvider"

import { Button } from "@mui/material"
import Link from "next/link"
import axios from "axios"
import { useRouter } from 'next/router';

export default function LoginPage() {


    const { count, setCount } = useContext(Context)
    const router = useRouter();
    return (

        <>
            <Link href="/" ><h1>LoginPage{count}</h1></Link>
            <Button variant="contained" onClick={function () {
                setCount(pre => pre + 1)
            }}>add</Button>
            <br />
            <Button variant="contained" onClick={function () {
                axios.get("/api/usercookie").then(response=>{

                   router.replace("/")
                })
            }}>Get Cookie</Button>

        </>

    )
}