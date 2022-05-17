const { TextBlock } = require("../../../../db/schema")



export default function handler(req, res) {



    return TextBlock.deleteOne({ _id: req.query.preHtmlId }).then(doc => {
        res.send(doc)
    })


}

