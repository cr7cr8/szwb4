const { commentBlock } = require("../../../../db/schema")
const { subCommentBlock } = require("../../../../db/schema")



export default function handler(req, res) {

    subCommentBlock.deleteMany({
        commentId: req.query.commentId
    }).then(doc=>{
        console.log(doc)
    })


    return commentBlock.deleteOne({
        _id: req.query.commentId
    }).then(docs => {

        res.send(docs)
    })

}
