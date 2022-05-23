const { TextBlock } = require("../../../../db/schema")




export default function handler(req, res) {

  // console.log(req.query.contentId)

  const [beforeTime = new Date()] = req.query.arr

  // console.log(beforeTime)

  return TextBlock.find({
    //contentId: contentId,
    postDate: { $lt: beforeTime }

  }).sort({ postDate: -1 }).limit(5).then(docs => {


    const contentArr = docs.map(doc => {
      //  console.log(doc.postDate)
      return { _id: doc._id, content: doc.content, ownerName: doc.ownerName, postDate: String(doc.postDate) }
    })



    res.send(contentArr)
  })

}
