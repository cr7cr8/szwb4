const { SubCommentBlock } = require("../../../../db/schema")




export default function handler(req, res) {

    // console.log(req.query.contentId)

    const [commentId, beforeTime = new Date()] = req.query.arr

    // console.log(beforeTime)

    return SubCommentBlock.find({
        commentId,
        postDate: { $lt: beforeTime }

    }).sort({ postDate: -1 }).limit(5).then(docs => {

        res.send(docs)
    })

}
