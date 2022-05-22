

const { VoteBlock } = require("../../../../db/schema")



export default function handler(req, res) {


    return VoteBlock.findOne({ _id: req.query.voteid }).then(doc => {
        res.send(doc)
    })


}
