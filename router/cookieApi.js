const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");




router.get('/', (req, res) => {
    res.cookie('userCookie', { userName: "user-" + Date.now() }, {
        maxAge: 1000 * 60 * 60 * 24 * 365,
        httpOnly: true,
        signed: true
    });
    res.json("cookieSent")
})




router.delete('/', (req, res) => {


    res.cookie('userCookie', { userName: "user-" + Date.now() }, {
        maxAge: 0,
        httpOnly: true,
        signed: true
    });
    res.json("cookieDelete")
})



module.exports = router