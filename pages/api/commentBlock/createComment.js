const { commentBlock } = require("../../../db/schema")




export default function handler(req, res) {


    console.log(req.body)
    return commentBlock.create({
        ...req.body,
    }).then(doc => {
        console.log(doc)
        res.send(doc)
    })

}
