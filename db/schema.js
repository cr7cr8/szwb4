const mongoose = require("mongoose");


//const { connSzwb4DB } = require("./db")



const userSchema = new mongoose.Schema({

    // _id: { type: String, required: true },

    userName: { type: String, unique: true },
    description: { type: String, default: "Nothing wrritten yet ..." },
    colorIndex: { type: Number, default: 5 },
    themeMode: { type: String, default: "light" },
    createDate: { type: Date, default: Date.now },
    hasAvatar: { type: Boolean, default: false }

}, {
    toObject: { virtuals: true },
    collection: "user",
    //  timestamps: true, 
})



const textBlockSchema = new mongoose.Schema({

    _id: { type: String, required: true },
    content: { type: String, required: true },
    ownerName: { type: String },
    postDate: { type: Date, default: Date.now }

}, {
    toObject: { virtuals: true },
    collection: "textBlocks",
    //  timestamps: true, 
})


const commentBlockSchema = new mongoose.Schema({

    _id: { type: String, required: true },
    content: { type: String, required: true },
    ownerName: { type: String },
    postDate: { type: Date, default: Date.now },
    contentId: { type: String, required: true },
}, {
    toObject: { virtuals: true },
    collection: "commentBlocks",
    //  timestamps: true, 
})

const subCommentBlockSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    content: { type: String, required: true },
    ownerName: { type: String },
    postDate: { type: Date, default: Date.now },
    commentId: { type: String, required: true },
}, {
    toObject: { virtuals: true },
    collection: "subCommentBlocks",
})


const voteBlockSchema = new mongoose.Schema({

    _id: { type: String, required: true },
    voteTopic: { type: String },
    voteArr: { type: [String], default: ["Choice 1"] },
    voteCountArr: { type: [Number], default: [0] },

    pollDuration: { type: Object },
    expireDate: { type: Date, default: Date.now },
    postId: { type: String },
    ownerName: { type: String },
    whoVoted: { type: [String], default: [] },

}, {
    toObject: { virtuals: true },
    collection: "voteBlocks",
    //  timestamps: true, 
})

const User = mongoose.models?.User || mongoose.model("User", userSchema);
const VoteBlock = mongoose.models?.VoteBlock || mongoose.model("VoteBlock", voteBlockSchema);
const TextBlock = mongoose.models?.TextBlock || mongoose.model("TextBlock", textBlockSchema);
const CommentBlock = mongoose.models?.CommentBlock || mongoose.model("CommentBlock", commentBlockSchema);
const SubCommentBlock = mongoose.models?.SubCommentBlock || mongoose.model("SubCommentBlock", subCommentBlockSchema);


module.exports = { User, VoteBlock, TextBlock, CommentBlock, SubCommentBlock }