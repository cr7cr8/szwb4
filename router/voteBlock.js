const express = require("express");
const router = express.Router();
const { VoteBlock } = require("../db/schema")





router.post("/createVote", function (req, res, next) {

    console.log("vvvvvv")
    VoteBlock.create({
        _id: req.body.voteId,
        ...req.body,
        voteCountArr: req.body.voteArr.map(item => 0/* Number((Math.random() * 100).toFixed(0)) */)


    }).then(doc => {
        res.json(doc)
    })
}
)

router.get("/getVoteCount/:voteid", function (req, res, next) {
    VoteBlock.findOne({ _id: req.params.voteid }).then(doc => {
        res.json(doc)
    })
})

router.put("/updateVoteCount/:voteId/:choicePos/:userName", function (req, res, next) {



    const arrPos = "voteCountArr." + req.params.choicePos

    VoteBlock.updateMany({ _id: req.params.voteId }, {


        "$inc": { [arrPos]: 1 }, //"$inc": { "voteCountArr.$[keyName]": 1 },

          "$addToSet": { whoVoted: req.params.userName }


    }).then((doc) => {
        res.json(doc)

    })


})


module.exports = router