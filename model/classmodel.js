const mongoose = require('mongoose');
const User = require('./usermodel');
const Clas = mongoose.model("Class", new mongoose.Schema({
    classname: {
        type: String,
        required: true
    },
    subjectname: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    students: {
        type: Number,
        default: 0,
        required: true
    },
    author: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: User,
        required: true
    }]
}))

module.exports = Clas;