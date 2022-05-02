import React, { useContext, useEffect } from "react"
import { Context, ContextProvider } from "../../ContextProvider"

import { Button } from "@mui/material"
import Link from "next/link"



import { useRouter } from 'next/router'



export async function getStaticPaths(context) {


    return {
        paths: [
            { params: { testId: ["111", "222"] } }
        ],
        fallback: "blocking" // false or 'blocking'
    };
}

export async function getStaticProps({ params, ...other }) {

    console.log(other)
    return {
        props: {
            params
        },
        revalidate: 3600,
    }

}


export default function Products({ params }) {



    const router = useRouter()


    useEffect(function () {



    }, [])

    if (router.isFallback) {
        return <div>Loading...</div> //not expected to render due to fallback is "blocking" not true
    }


    return (

        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", backgroundColor: "pink", height: "80vh" }}>
            <h1>products</h1>

            {/* <div>
                {paramArr.map((item, index) => <b key={index}>{item}&nbsp;</b>)}
            </div> */}

            <div>
                {JSON.stringify(params)}
            </div>
            {/* <Link href="/" ><h1>go to Home {count}</h1></Link>
            <Button variant="contained" onClick={function () {
                setCount(pre => pre + 1)
            }}>add</Button> */}
        </div>

    )
}