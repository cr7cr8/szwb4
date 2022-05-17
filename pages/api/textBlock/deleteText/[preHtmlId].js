const { TextBlock } = require("../../../../db/schema")



export default function handler(req, res) {


    // console.log("texttexttexttttttttttttttttt",req.body)
console.log(req.query.preHtmlId)
    return TextBlock.deleteOne({ _id: req.query.preHtmlId }).then(doc => {
        res.send(doc)
    })

    // return TextBlock.({
    //     ...req.body


    // }).then(doc => {
    //     res.send(doc)
    // })

}

