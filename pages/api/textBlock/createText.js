const { TextBlock } = require("../../../db/schema")



export default function handler(req, res) {


   // console.log("texttexttexttttttttttttttttt",req.body)

    return TextBlock.create({
        ...req.body


    }).then(doc => {
        res.send(doc)
    })

}

