const { subCommentBlock } = require("../../../../db/schema")




export default function handler(req, res) {

    // console.log(req.query.contentId)

    return subCommentBlock.countDocuments({ commentId: req.query.commentId }).then(num => {



        res.send(num)

    })

    //   return commentBlock.find({
    //     contentId: req.query.contentId
    //   }).sort({postDate:-1}).then(docs => {

    //     res.send(docs)
    //   })

}
