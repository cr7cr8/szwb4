
const { VoteBlock } = require("../../../../db/schema")




export default function handler(req, res) {


    //console.log("vote arr is ", req.query.arr)

    const [voteId, choicePos, userName] = req.query.arr
    const arrPos = "voteCountArr." + choicePos

    return VoteBlock.updateMany({ _id: voteId }, {

        "$inc": { [arrPos]: 1 }, //"$inc": { "voteCountArr.$[keyName]": 1 },
        "$addToSet": { whoVoted: userName }

    }).then((doc) => {
        res.send(doc)

    })

}







