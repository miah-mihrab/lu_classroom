const User = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    JWT_SECRET
} = require('../config/secrets');
module.exports = {

    //GET SIGNIN PAGE
    getSignIn(req, res) {
        if (res.cookie('jwt')) {
            res.clearCookie('jwt');
        }
        res.status(200).render("signin", {
            title: "Sign In"
        });
    },

    //GET REGISTRATION PAGE
    getReg(req, res) {
        if (res.cookie('jwt')) {
            res.clearCookie('jwt');

        }
        res.status(200).render("registration", {
            title: "Register Here"
        });
    },

    // POST CREDENTIALS & VERIFY
    async postSignIn(req, res, next) {
        let {
            email,
            password
        } = await req.body;
        //console.log(password);
        if (!email || !password) {
            res.render("signin", {
                message: "Please fill your info."
            });
        } else {
            const user = await User.findByCredentials(email, password);
            // console.log(user);
            if (user) {
                const token = jwt.sign({
                        _id: user._id,
                        name: user.firstname + " " + user.lastname,
                        profession: user.profession
                    },
                    JWT_SECRET
                );
                if (token) {
                    //res.header("x-auth-token", token);
                    await res.cookie("jwt", token);
                    return res.status(200).redirect('/');
                }
                res.status(307).redirect('/'); //Temporary Redirected


            } else {
                const err = new Error("Please provide correct info!");
                err.status = "Unauthorized";
                err.statusCode = 401;
                next(err);
            }
        }
    },

    // VERIFY & REGISTER
    async postReg(req, res, next) {
        let {
            firstname,
            lastname,
            email,
            password,
            id,
            department,
            profession,
            dob
        } = await req.body;

        await bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(password, 10, async (err, hash) => {
                password = hash;
                const user = await new User({
                    firstname,
                    lastname,
                    id,
                    email,
                    password,
                    department,
                    profession,
                    dob
                });
                try {
                    await user.save().then(() => {
                        console.log("Saved");
                    });

                    const token = await jwt.sign({
                            _id: user._id,
                            name: user.firstname + " " + user.lastname,
                            profession: user.profession
                        },
                        JWT_SECRET
                    );
                    if (token) {
                        //res.header("x-auth-token", token);
                        await res.cookie("jwt", token);

                        return res.status(200).redirect("/");
                        // res.redirect('/');
                    }
                    res.status(307).redirect("/"); //Temporary Redirected
                    //console.log("New User Saved");
                } catch (err) {
                    console.log(req.body)
                    // const err = new Error("Something gone wrong on user registration");
                    // err.status = "No Response";
                    // err.statusCode = 444;
                    next(err);
                }
            });
        });
    }
}