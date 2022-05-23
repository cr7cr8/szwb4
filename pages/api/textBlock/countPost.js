const { TextBlock } = require("../../../../db/schema")




export default function handler(req, res) {

    // console.log(req.query.contentId)



    // console.log(beforeTime)

    return TextBlock.countDocuments({  }).then(num => {

        res.send(num)

    })

}
