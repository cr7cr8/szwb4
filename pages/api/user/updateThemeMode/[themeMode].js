const { User } = require("../../../../db/schema")
const signer = require('cookie-signature');
import { getCookie, getCookies, setCookies } from 'cookies-next';

function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}

function verifyCookie(req, res, next) {

    const cookie = getCookie("signedCookieObj", { req, res })
    if (cookie) {
        const checkedCookie = signer.unsign(cookie, 'this-is-a-cookieSecretKey')
        if (checkedCookie) {
            req.userName = JSON.parse(checkedCookie).userName
            next(req.userName)
        }
        else {
            req.userName = false
            next(false)
        }
    }
    else {
        req.userName = false
        next(false)
    }
}



export default async function handler(req, res) {
    const themeMode = req.query.themeMode
    await runMiddleware(req, res, verifyCookie)
    if (!req.userName) {
        return res.send("cookie failed")
    }
    return User.findOneAndUpdate({ userName: req.userName }, { themeMode }).then(doc => {
        return res.send("update done")
    })
}