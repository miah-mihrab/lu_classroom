const mongoose = require('mongoose');
const CommentSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true
    },
    post: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post"
    },
    author: {
        type: String
    },
    time: {
        type: Date,
        required: true,
        default: Date.now()
    }
});


const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;