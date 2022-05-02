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

const cookieApi = require("./router/cookieApi")


console.log(">> Process.env.NODE_ENV = " + process.env.NODE_ENV, process.env.PORT || port)

app.prepare().then(

    () => {
        express.disable('x-powered-by');
        express.use(cors({}))
        express.use(cookieParser('cookieSecretKey'))




        express.use('/api/userCookie', cookieApi)

        express.use('/api/404', function (req, res) {

            res.status(403).send("404")

        })

        express.get('/api/*', (req, res) => {
            res.send("api-----dd--")
        })

        express.get('/api', (req, res) => {
            res.send("api")
        })


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
        //             res.cookie('signedCookieObj', { a: 1, b: 2 }, {
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