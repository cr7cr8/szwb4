const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')
const express_ = require("express")
const express = express_()

const cors = require("cors")



const dev = process.env.NODE_ENV !== 'production'
const hostname = '192.168.0.100'
const port = 3000
//when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port })



const handle = app.getRequestHandler()
const cookieParser = require('cookie-parser')


const { authenticateToken, generateAndDispatchToken, checkingToken } = require("./middware/auth")



const { getCookie, getCookies, setCookies } = require('cookies-next');
const signer = require('cookie-signature');


const cookieApi = require("./router/cookieApi")
const picture = require("./router/picture")
const voteBlock = require("./router/voteBlock")
const textBlock = require("./router/textBlock")

console.log(">> Process.env.NODE_ENV = " + process.env.NODE_ENV, process.env.PORT || port)

app.prepare().then(

    () => {
        express.disable('x-powered-by');
        express.use(express_.json())
        express.use(express_.urlencoded({ extended: true }))

        express.use(cors({}))
        //  express.use(cookieParser('this-is-a-cookieSecretKey'))

        express.use((req, res, next) => {
            req.isCookieValid = null
            const cookie = getCookie("signedCookieObj", { req, res })
            //console.log("hasCookie", cookie ? true : false)

            if (cookie) {
                const checkedCookie = signer.unsign(cookie, 'this-is-a-cookieSecretKey')
                // console.log("is Cookie valid", checkedCookie ? true : false)
                // checkedCookie && console.log("Cookie value is ", JSON.parse(checkedCookie).userName)
                req.userName = JSON.parse(checkedCookie).userName
            }
            else {
                setCookies('signedCookieObj', { userName: "User" + Number(Math.random() * 1000).toFixed(0) }, { req, res, maxAge: 3600 * 24 * 365, httpOnly: true, sameSite: "lax" });
                const newCookie = getCookie("signedCookieObj", { req, res })
                const newSignedCookie = signer.sign(newCookie, 'this-is-a-cookieSecretKey')
                setCookies('signedCookieObj', newSignedCookie, { req, res, maxAge: 3600 * 24 * 365, httpOnly: true, sameSite: "lax" });
                // console.log("new Signed Cookie", newSignedCookie)
                req.userName = JSON.parse(newSignedCookie).userName
            }
            next()
         
        })

        //express.use('/api/cookie', cookieApi)
        express.use('/api/picture', picture)
        express.use('/api/voteBlock', voteBlock)
        express.use('/api/textBlock', textBlock)

        express.get("/", function (req, res, next) {



            //let userName = req.signedCookies?.signedCookieObj?.userName || "User" + String(Math.random()).substring(4, 7)
            // if (!(req.signedCookies?.signedCookieObj?.userName)) {
            //     res.cookie('signedCookieObj', { userName }, {
            //         maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 15 minutes
            //         httpOnly: true, // The cookie only accessible by the web server
            //         signed: true // Indicates if the cookie should be signed
            //     });

            // }

            app.render(req, res, "/", { userName: req.userName })
        })





        // express.use('/api/404', function (req, res) {

        //     res.status(403).send("404")

        // })

        // express.get('/api/*', (req, res) => {
        //     res.send("api-----dd--")
        // })

        // express.get('/api', (req, res) => {
        //     res.send("api")
        // })


        // express.get(/(^\/$)|(^\/home$)/i,
        //     function (req, res, next) {

        //         if (!(req?.signedCookies?.userCookie?.userName)) {
        //             app.render(req, res, "/LoginPage", {})
        //         }
        //         else {
        //             //   console.log(req.signedCookies)

        //             app.render(req, res, "/Home", {})
        //         }
        //     }
        // )
        express.get(/(^\/home$)/i,
            function (req, res, next) {

                if (!(req?.signedCookies?.userCookie?.userName)) {
                    app.render(req, res, "/LoginPage", {})
                }
                else {
                    //   console.log(req.signedCookies)

                    app.render(req, res, "/Home", {})
                }
            }
        )

        express.get("/person",
            function (req, res, next) {
                req.dataObj = 3333333333

                app.render(req, res, "/PersonPage", {})

            }
        )


        // express.get(/(^\/$)|(^\/home$)/i,
        //     checkingToken(
        //         function (req, res, next) {
        //             // console.log(req.cookies)

        //             console.log(cookieParser.JSONCookie({ "aaa": 111, "bbb": 222 }))


        //             console.log(req.signedCookies)
        //             //  res.cookie('cookieName', 'cookie-'+Date.now(), { signed: true })
        //             res.cookie('signedCookieObj', { userName: "User" + String(Math.random()).substring(4, 7) }, {
        //                 maxAge: 1000 * 60 * 60 * 24 * 365, // would expire after 15 minutes
        //                 httpOnly: true, // The cookie only accessible by the web server
        //                 signed: true // Indicates if the cookie should be signed
        //             });
        //             app.render(req, res, "/Home", {})
        //         },
        //         function (req, res, next) {

        //             app.render(req, res, "/LoginPage", {})

        //         }

        //     ),
        //     (req, res, next) => {
        //         console.log("home page", req.params)
        //         app.render(req, res, "/PersonPage", {})
        //     }
        // )


        // express.get(/(^\/$)|(^\/home$)/i, (req, res, next) => {
        //     console.log("home page", req.params)
        //     app.render(req, res, "/", {})
        // })

        // express.get("/",(req,res,next)=>{
        //     console.log("home page",req.params)
        //     app.render(req, res, "/", {})
        // })




        // express.use('/ttt', (req, res) => {
        //     app.render(req, res, "/", {aa:"fff"})
        // })

        // app.render(req, res, actualPage, queryParams)

        express.get('*', (req, res) => {
            return handle(req, res)
        })


        express.listen(process.env.PORT || port, (err) => {
            if (err) throw err
            console.log(`>> Ready on ${hostname}:${process.env.PORT || port}`)
        })


    }
)



// express.listen(process.env.PORT || port, (err) => {
//     if (err) throw err
//     console.log(`>> Ready on ${hostname}:${process.env.PORT || port}`)
// })



// express.get("/abab",function(req,res,next){
//     res.send(String(Date.now()))
// })

//express.listen(port)