const mongoose = require('mongoose');
const User = require('./usermodel');

const Comment = mongoose.model("Comment", new mongoose.Schema({
    comment: {
        type: String
    },
    person: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }]
}))
const Room = mongoose.model('Room', new mongoose.Schema({
    teacherName: {
        type: String,
        required: true
    },
    roomName: {
        type: String,
        required: true
    },
    batch: {
        type: Number,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    content: {
        type: Array
    }
}));
const Post = mongoose.model('Post', new mongoose.Schema({
    author: {
        type: String,
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
}));