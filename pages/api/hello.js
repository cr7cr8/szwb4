// Next.js API route support: https://nextjs.org/docs/api-routes/introduction



import { getCookie, getCookies, setCookies } from 'cookies-next';



const signer = require('cookie-signature');

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




export default async function handler(req, res) {
  await runMiddleware(req, res, function (req, res, next) {
    console.log(new Date()); next()
  })
  await runMiddleware(req, res, checkingCookie)
  res.send(req.userName)
}



function checkingCookie(req, res, next) {
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
    const userName = "User" + Number(Math.random() * 1000).toFixed(0)
    setCookies('signedCookieObj', { userName }, { req, res, maxAge: 3600 * 24 * 365, httpOnly: true, sameSite: "lax" });
    const newCookie = getCookie("signedCookieObj", { req, res })
    const newSignedCookie = signer.sign(newCookie, 'this-is-a-cookieSecretKey')
    setCookies('signedCookieObj', newSignedCookie, { req, res, maxAge: 3600 * 24 * 365, httpOnly: true, sameSite: "lax" });
    console.log("new Signed Cookie", newSignedCookie)


    req.userName = userName
  }
  next()

}