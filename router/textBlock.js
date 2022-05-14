const express = require("express");
const router = express.Router();
const { TextBlock } = require("../db/schema")


router.post("/createText", function (req, res, next) {


    TextBlock.create({
        ...req.body


    }).then(doc => {
        res.json(doc)
    })
})

router.get("/getText", function (req, res, next) {

    TextBlock.find({}).then(docs => {

        res.json(docs)

    })


})

module.exports = router