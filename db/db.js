const mongoose = require("mongoose")
mongoose.connection.on('error', function (err) {
    // console.log('Mongoose default connection error: ' + err);

    // console.log("aaaaaaaaaaaaaaa")
});

const { connSzwb4DB, connParam } = {

    szwb4DB: "mongodb+srv://boss:ABCabc123@cluster0.7ijmi.mongodb.net/szwb4DB?retryWrites=true&w=majority",
    connParam: { useNewUrlParser: true, useUnifiedTopology: true, /*poolSize:10*/ },

    get connSzwb4DB() {
        return mongoose.createConnection(this.szwb4DB, this.connParam)
    },

}





function wrapAndMerge(...args) {

    return args.map(function (fn) {
        return {
            [fn.name]: function (req, res, next) {
                try {
                    const obj = fn(req, res, next);
                    return (Promise.resolve(obj) === obj)
                        ? obj.catch(ex => res.send(`<h1>Async error from function <br> ${fn.name}<br> ${ex}</h1>`))
                        : obj
                }
                catch (ex) { res.send(`<h1>something wrong when calling function  <br> ${fn.name}<br></h1> ${ex.stack}`) }
            }
        }
    }).reduce(
        function (accumulator, currentValue) {
            return { ...accumulator, ...currentValue }
        })
}

module.exports = {

    connSzwb4DB,
    wrapAndMerge,
}
