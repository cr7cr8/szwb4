const { subCommentBlock } = require("../../../db/schema")




export default function handler(req, res) {


    return subCommentBlock.create({
        ...req.body,
    }).then(doc => {
      //  console.log(doc)
        res.send(doc)
    })

}
