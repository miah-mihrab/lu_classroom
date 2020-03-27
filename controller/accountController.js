const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");

const {
    JWT_SECRET
} = require("../config/secrets");


// USER ACCOUNT INFORMATION
exports.getAccount = async (req, res, next) => {
        // const userID = req.user._id;
        res.locals.userID = req.user._id;
        const user = await User.findById(req.params.id);
        await res.render("accountInfos", {
            firstname: user.firstname,
            lastname: user.lastname,
            email: user.email,
            id: user.id,
            dob: user.dob,
            batch: user.batch,
            semester: user.semester,
            section: user.section,
            teacher: req.user.profession === "Teacher" ? true : false,
            userPhoto: user.photo ? user.photo.toString('base64') : null
        });
    },

    // UPDATE ACCOUNT
    exports.patchAccount = async (req, res, next) => {
    const userID = await req.user._id;
    const UserData = await User.findById(userID);
        let {
            firstname,
            lastname,
            email,
            id,
            dob,
            batch,
            semester,
            section
    } = await req.body;
    
        let date = dob ? dob.split("-") : null;
        dob = date ? date.join("/") : null;
        await User.findByIdAndUpdate({
            _id: userID
        }, {
            firstname,
            lastname,
            email,
            id,
            batch,
            semester,
            section,
            dob,
            photo: req.user.photo ? req.user.photo : UserData.photo
        }, {
            new: true,
            runValidators: true
        });
        const token = await jwt.sign({
                _id: userID,
                name: firstname + " " + lastname,
                profession: req.user.profession
            },
            JWT_SECRET
        );
        if (token) {
            //res.header("x-auth-token", token);
            await res.clearCookie("jwt");
            await res.cookie("jwt", token);
            return res.status(200).redirect(`/account/${req.params.id}`);
        }
    }