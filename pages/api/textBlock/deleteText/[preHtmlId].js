const { TextBlock } = require("../../../../db/schema")
const { CommentBlock } = require("../../../../db/schema")


export default function handler(req, res) {

    CommentBlock.deleteMany({ contentId: req.query.preHtmlId })

    return TextBlock.deleteOne({ _id: req.query.preHtmlId }).then(doc => {
        res.send(doc)
    })


}

