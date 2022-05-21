const { subCommentBlock } = require("../../../../db/schema")




export default function handler(req, res) {


    return subCommentBlock.deleteOne({
        _id: req.query.subCommentId
    }).then(docs => {

        res.send(docs)
    })

}
