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
        type: String
    },
    assignmentname: {
        type: String,
        required: true
    },
    details: {
        type: String
    },
    date: {
        type: String,
    },
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    submitted: [{
        id: {
            type: String
        },
        studentname: {
            type: String,
            required: true
        },
        classroom: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Classroom'
        },

        file: [String],
        fileName: {
            type: String
        },
        assignmentname: {
            type: String
        },
        date: {
            type: String,
        },
        details: {
            type: String
        }
    }]
});

ClassworkSchema.pre('save', function () {
    this.date = moment().format("MMMM Do YYYY, h:mm a");
    console.log(this.time);
});

const Classwork = mongoose.model('Classwork', ClassworkSchema);

module.exports = Classwork;