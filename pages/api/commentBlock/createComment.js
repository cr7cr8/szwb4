const { CommentBlock } = require("../../../db/schema")




export default function handler(req, res) {


    return CommentBlock.create({
        ...req.body,
    }).then(doc => {
      //  console.log(doc)
        res.send(doc)
    })

}
