const mongoose = require('mongoose');
const User = require('./usermodel');

const PostSchema = new mongoose.Schema({
    class: {
        type: mongoose.Schema.Types.ObjectId,
            ref: "_Class",
            required: true
    },
    time: {
        type: Date,
        required: true,
        default: Date.now
    },
    content: {
        type: String,
        required: true
    },
    attachment: {
        type: Buffer
    }
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;

// const Comment = mongoose.model("Comment", new mongoose.Schema({
//     comment: {
//         type: String
//     },
//     person: [{
//         type: mongoose.Schema.Types.ObjectId,
//         ref: User
//     }]
// }));


// const Room = mongoose.model('Room', new mongoose.Schema({
//     teacherName: {
//         type: String,
//         required: true
//     },
//     roomName: {
//         type: String,
//         required: true
//     },
//     batch: {
//         type: Number,
//         required: true
//     },
//     subject: {
//         type: String,
//         required: true
//     },
//     content: {
//         type: Array
//     }
// }));