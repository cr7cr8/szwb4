const { TextBlock } = require("../../../../db/schema")
const { commentBlock } = require("../../../../db/schema")


export default function handler(req, res) {

    commentBlock.deleteMany({ contentId: req.query.preHtmlId })

    return TextBlock.deleteOne({ _id: req.query.preHtmlId }).then(doc => {
        res.send(doc)
    })


}

