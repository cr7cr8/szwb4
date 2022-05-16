

const [{
    checkConnState, getFileArray,
    uploadFile, downloadFile,
    deleteFileById, deleteOldFile,
    downloadFileByName, getSmallImageArray,
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



    await runMiddleware(req, res, checkConnState)
    await runMiddleware(req, res, downloadFile)

}



// router.get("/downloadPicture/:filename",


//     function (req, res, next) {
//         console.log("download pic")
//         next()
//     },

//     checkConnState, downloadFile)

