const { SubCommentBlock } = require("../../../../db/schema")




export default function handler(req, res) {


    return SubCommentBlock.deleteOne({
        _id: req.query.subCommentId
    }).then(docs => {

        res.send(docs)
    })

}
