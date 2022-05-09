const mongoose = require("mongoose");
const { connSzwb4DB } = require("./db")





const voteBlockSchema = new mongoose.Schema({

    _id: { type: String, required: true },
    voteTopic: { type: String },
    voteArr: { type: [String], default: ["Choice 1"] },
    voteCountArr: { type: [Number], default: [0] },

    pollDuration: { type: Object },
    expireDate: { type: Date, default: Date.now },
    postID: { type: String },
    ownerName: { type: String },
    whoVoted: { type: [String], default: [] },

}, {
    toObject: { virtuals: true },
    collection: "voteBlocks",
    //  timestamps: true, 
})


const VoteBlock = connSzwb4DB.model("voteBlocks", voteBlockSchema);

module.exports = { VoteBlock }