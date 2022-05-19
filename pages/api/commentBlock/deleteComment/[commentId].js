const { commentBlock } = require("../../../../db/schema")




export default function handler(req, res) {


    return commentBlock.deleteOne({
        _id: req.query.commentId
    }).then(docs => {

        res.send(docs)
    })

}
