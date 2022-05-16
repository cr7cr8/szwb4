

const { VoteBlock } = require("../../../../db/schema")



function runMiddleware(req, res, fn) {
    return new Promise((resolve, reject) => {
        fn(req, res, (result) => {
            if (result instanceof Error) {
                return reject(result)
            }

            return resolve(result)
        })
    })
}




export default function handler(req, res) {


    //console.log("voteid is ", req.query.voteid, req.method)

    return VoteBlock.findOne({ _id: req.query.voteid }).then(doc => {
        res.send(doc)
    })


}
