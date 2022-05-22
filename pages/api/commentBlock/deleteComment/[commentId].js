const { CommentBlock } = require("../../../../db/schema")
const { SubCommentBlock } = require("../../../../db/schema")



export default function handler(req, res) {

    SubCommentBlock.deleteMany({
        commentId: req.query.commentId
    }).then(doc=>{
        console.log(doc)
    })


    return CommentBlock.deleteOne({
        _id: req.query.commentId
    }).then(docs => {

        res.send(docs)
    })

}
