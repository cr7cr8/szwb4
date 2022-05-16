const [{
    checkConnState, getFileArray,
    uploadFile, downloadFile,
    deleteFileById, deleteOldFile,
    downloadFileByName, getSmallImageArray,
    getSmallImageArray2 }] = require("../../../db/fileManager");


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

export const config = { api: { bodyParser: false }}
export default async function handler(req, res) {

    await runMiddleware(req, res, function (req, res, next) {
        console.log("uploadPciture2")
        next()
    })

    await runMiddleware(req, res, checkConnState)

    await runMiddleware(req, res, getFileArray)

    await runMiddleware(req, res, getSmallImageArray2)

    await runMiddleware(req, res, uploadFile)


    return res.send("got image 2")



}
