const mongoose = require('mongoose');

const AssignmentSubmissionSchema = new mongoose.Schema({
    assignmentId: {
        type: mongoose.Schema.ObjectId,
        ref: "Classwork",
    },
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
});

const AssignmentSubmission = mongoose.model('Assignment-submission', AssignmentSubmissionSchema);

module.exports = AssignmentSubmission;