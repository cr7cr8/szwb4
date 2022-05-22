const [
    { },
    {
        checkConnState, getFileArray,
        uploadFile, downloadFile,
        deleteFileById, deleteOldFile,
        deleteFileByFileName,
        downloadFileByName, getSmallImageArray,
        getSmallImageArray2
    }
] = require("../../../../db/fileManager");

const { User } = require("../../../../db/schema")

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




export const config = { api: { bodyParser: false } }
export default async function handler(req, res) {


    req.userName = req.query.filename
    await runMiddleware(req, res, function (req, res, next) {

        next()
    })

    await runMiddleware(req, res, checkConnState)

    await runMiddleware(req, res, getFileArray)
    //await runMiddleware(req, res, tofileArr)


    await runMiddleware(req, res, getSmallImageArray)

    await runMiddleware(req, res, deleteFileByFileName)


    await runMiddleware(req, res, uploadFile)
    User.findOneAndUpdate({ userName: req.userName }, { hasAvatar: true }, { new: true }).then(doc => {
    //    console.log(doc)
    })

    return res.send("got avatar ")


}