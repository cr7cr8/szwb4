const jwt = require("jsonwebtoken")

///next dev --port $PORT

function checkingToken(noToken, tokenFailFn, tokenPassFn) {


    return function checkToken(req, res, next) {
        try {
            const token = req.header("x-auth-token")

            //console.log(token)

            if (!token) { return noToken(req, res, next)  }


            const decoded = jwt.verify(token, "secretKey")

            req.header["user"] = decoded
            req.user = decoded
            tokenPassFn
                ? tokenPassFn(req, res, next)
                : next()
        }
        catch (err) {
            console.log("token checking failed")
            tokenFailFn(req, res, next)
        }

    }

}

function authenticateToken(req, res, next) {



    try {
        const token = req.header("x-auth-token")
        if (!token) { return res.status(401).send("Access denied,no token provided") }


        const decoded = jwt.verify(token, "secretKey")

        req.header["user"] = decoded
        req.user = decoded
        next()
    }
    catch (err) {
        return res.status(400).json("Invalid token")
    }
}



function generateAndDispatchToken(req, res, next) {

    /**  Token content is req.body */
    const token =
        jwt.sign({ userName: req.body.userName }, 'secretKey', { expiresIn: "1000d" })

    res
        .header("x-auth-token", token)
        .header("access-control-expose-headers", "x-auth-token")
        .json({ userName: req.body.userName })

    // console.log("token sent")

}







module.exports = {
    generateAndDispatchToken,

    authenticateToken,
    checkingToken
}