const Classes = require('./classroommodel')
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const AppError = require('../utils/appError');

const UserSchema = mongoose.Schema({
    firstname: {
        type: String,
        required: true,
        trim: true
    },
    lastname: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        select: false
    },
    id: {
        type: Number,
        required: true,
        trim: true
    },
    department: {
        type: String,
        required: true
    },
    profession: {
        type: String,
        required: true
    },
    batch: {
        type: String,
        default: null
    },
    section: {
        type: String,
        default: null
    },
    dob: {
        type: String,
        default: null
    },
    Classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: Classes
    }]
})



//Find User 
UserSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    }).select('+password');
    if (!user)
        return false;

    const matchPass = await bcrypt.compare(password, user.password)
    console.log(matchPass)
    if (!matchPass)
        return false;

    return {
        "_id": user._id,
        "email": user.email,
        "firstname": user.firstname,
        "lastname": user.lastname,
        "profession": user.profession
    };

}


const User = mongoose.model('User', UserSchema);
module.exports = User;