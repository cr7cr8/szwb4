
import React, { useState, useContext, useEffect, useId, useTransition, memo, useCallback, useRef } from "react"

const dbConnect = require("../db/dbConnect")
const { TextBlock, User } = require("../db/schema");


export async function getServerSideProps() {
    const aaa = await dbConnect["default"]()

    console.log(aaa.connections)

    // return {
    //     props: {}
    // }
    return User.find({}).then(docs => {
        //console.log(docs)

        return {
            props: {

            }
        }

    })

}


export default function Index() {

    return (

        <h1>aaassdd</h1>

    )


}