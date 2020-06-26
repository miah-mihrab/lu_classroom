const mongoose = require('mongoose');
const moment = require('moment');

const ClassworkSchema = new mongoose.Schema({
    authorName: {
        type: String,
        required: true
    },
    classroom: {
        type: mongoose.Types.ObjectId,
        ref: 'Post'
    },
    file: [String],
    fileName: {
        type: String,
        required: true
    },
    assignmentname: {
        type: String,
        required: true,
        unique: true
    },
    details: {
        type: String
    },
    date: {
        type: String,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        validate: (value => {
            console.log(this.students);
        })
    }],
    submitted: [{
        id: {
        type: String,
        required: true
    },
    studentname: {
        type: String,
        required: true
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },

    file: [String],
    fileName: {
        type: String,
        required: true
    },
    assignmentname: {
        type: String,
        required: true,
        unique: [true, "You already submitted this assignment, If you want to upload updated file just try 'assignmentname-updated'"]
    },
    date: {
        type: String,
    },
    details: String
    }]
});

ClassworkSchema.pre('save', function () {
    this.date = moment().format("MMMM Do YYYY, h:mm a");
    console.log(this.time);
});

const Classwork = mongoose.model('Classwork', ClassworkSchema);

module.exports = Classwork;