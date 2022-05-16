

const { VoteBlock } = require("../../../db/schema")




export default  function handler(req, res) {


   // console.log(req.body)
    return VoteBlock.create({
        _id: req.body.voteId,
        ...req.body,
        voteCountArr: req.body.voteArr.map(item => 0/* Number((Math.random() * 100).toFixed(0)) */)

    }).then(doc => {
        res.send(doc)
    })

}

