const { CommentBlock } = require("../../../../db/schema")




export default function handler(req, res) {

 // console.log(req.query.contentId)

    return CommentBlock.countDocuments({contentId: req.query.contentId}).then(num=>{



        res.send(num)

    })

//   return commentBlock.find({
//     contentId: req.query.contentId
//   }).sort({postDate:-1}).then(docs => {

//     res.send(docs)
//   })

}
