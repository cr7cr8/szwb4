const express = require("express");
const router = express.Router();
const { VoteBlock } = require("../db/schema")





router.post("/createVote", function (req, res, next) {


    VoteBlock.create({
        _id: req.body.voteId,
        ...req.body,
        voteCountArr: req.body.voteArr.map(item => Number((Math.random() * 100).toFixed(0)))
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

router.put("/updateVoteCount/:voteId/:choicePos", function (req, res, next) {

    console.log()

    const arrPos = "voteCountArr." + req.params.choicePos

    VoteBlock.updateMany({ _id: req.params.voteId }, {


        "$inc": { [arrPos]: 1 }, //"$inc": { "voteCountArr.$[keyName]": 1 },

      //  "$addToSet": { whoVoted: req.body.userName }


    }).then((doc) => {
        res.json(doc)

    })


})


module.exports = router