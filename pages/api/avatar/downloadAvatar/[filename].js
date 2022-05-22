

const [{ }, {
    checkConnState, getFileArray,
    uploadFile, downloadFile,
    deleteFileById, deleteOldFile,
    downloadFileByName, getSmallImageArray,
    deleteFileByFileName,
    getSmallImageArray2 }] = require("../../../../db/fileManager");



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

export default async function handler(req, res) {

    req.userName = req.query.filename

    await runMiddleware(req, res, checkConnState)
  
    await runMiddleware(req, res, downloadFile)

}
