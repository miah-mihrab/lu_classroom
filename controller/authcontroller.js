const User = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
    JWT_SECRET
} = require('../config/secrets');
module.exports = {

    //GET SIGNIN PAGE
    getSignIn(req, res) {
        res.render("signin", {
            title: "Sign In"
        });
    },

    //GET REGISTRATION PAGE
    getReg(req, res) {
        res.render("registration", {
            title: "Register Here"
        });
    },

    // POST CREDENTIALS & VERIFY
    async postSignIn(req, res) {
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
            //console.log(user);
            try {
                if (user) {
                    //console.log(user);
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

                        await res.redirect("/");
                        // res.redirect('/');
                    }
                } else {
                    res.json({
                        error: "Something gone wrong. Please provide correct info!"
                    });
                }
            } catch (e) {
                res.json({
                    error: e
                });
            }
        }
    },

    // VERIFY & REGISTER
    async postReg(req, res) {
        let {
            firstname,
            lastname,
            email,
            password,
            id,
            department,
            profession
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
                    profession
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

                        return res.redirect("/");
                        // res.redirect('/');
                    }
                    res.redirect("/");
                    //console.log("New User Saved");
                } catch (err) {
                    console.log(err)
                }
            });
        });
    }
}