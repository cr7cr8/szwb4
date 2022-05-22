const { SubCommentBlock } = require("../../../db/schema")




export default function handler(req, res) {


    return SubCommentBlock.create({
        ...req.body,
    }).then(doc => {
      //  console.log(doc)
        res.send(doc)
    })

}
