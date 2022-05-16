

import { NextResponse } from 'next/server'




export async function middleware(req, ...props) {

    const { pathname } = req.nextUrl
    //console.log("path ======>",pathname)
    // if (pathname == '/redirect') {
    //     return NextResponse.redirect('/hello-nextjs')
    // }





    return NextResponse.next()



}