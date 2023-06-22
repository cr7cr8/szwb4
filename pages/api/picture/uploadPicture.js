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
const multer = require("multer");

const tofileArr = multer({ storage: multer.memoryStorage() }).array("file", 789 /*789 is max count,default infinity*/)

export const config = { api: { bodyParser: false } }  //disabled it when uploading binary data like picutres

export default async function handler(req, res) {



    await runMiddleware(req, res, function (req, res, next) {

        next()
    })

    await runMiddleware(req, res, checkConnState)

    await runMiddleware(req, res, getFileArray)
    //await runMiddleware(req, res, tofileArr)

    await runMiddleware(req, res, getSmallImageArray)

    await runMiddleware(req, res, uploadFile)


    return res.send("got image snap")


}




