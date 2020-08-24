const User = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");
const sg = require('@sendgrid/mail');
sg.setApiKey("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");

const catchErrorAsync = fn => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};



//GET SIGNIN PAGE
(exports.getSignIn = async (req, res) => {
  if (res.cookie("jwt")) {
    res.cookie("jwt", undefined, {
      maxAge: 10000
    });
  }
  res.status(200).render("signin", {
    title: "Sign In"
  });
}),

  //GET REGISTRATION PAGE
  (exports.getReg = async (req, res) => {
    if (res.cookie("jwt")) {
      res.cookie("jwt", undefined, {
        expire: Date.now() + 10 * 1000
      });
    }
    res.status(200).render("registration", {
      title: "Register Here"
    });
  }),

  // POST CREDENTIALS & VERIFY
  (exports.postSignIn = catchErrorAsync(async (req, res, next) => {
    let {
      email,
      password
    } = await req.body;
    if (!email || !password) {
      next(new AppError("Please provide email and password!", 400));
    }
    else {
      const user = await User.findByCredentials(email, password);
      if (!user) {
        return next(new AppError("Please provide valid information", 401));
      } else if (user) {
        const token = jwt.sign({
          _id: user._id,
          name: user.firstname + " " + user.lastname,
          id: user.id,
          profession: user.profession
        },
          process.env.JWT_SECRET
        );
        if (token) {
          res.locals.teacher = user.profession === 'Student' ? false : true;
          await res.cookie("jwt", token);
          return res.send((user));

        }
        //Temporary Redirected
      } else {
        next(new AppError("Please provide correct info", 401));
      }
    }
  })),
  // VERIFY & REGISTER
  (exports.postReg = async (req, res, next) => {
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
        const user = new User({
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
          await user.save();
          const token = jwt.sign({
            _id: user._id,
            name: user.firstname + " " + user.lastname,
            profession: user.profession
          },
            process.env.JWT_SECRET
          );

        const msg = {
          "to": email,
          "from": 'miah.mihrab@gmail.com',
          "subject": 'Email verification mail',
          "template_id": "d-56f6a341589945db9e02ef93e957ebe1",
          "dynamic_template_data": {
            "link": `http://localhost:4200/user/verification/${token}`
          }
        };
        await sg.send(msg);
        console.log("message sent successfully")
          
          if (token) {
            console.log(email, password)
            const findUser = await User.findByCredentials(email, req.body.password);
            console.log(findUser, "FIND")
            return res.status(200).send(findUser)
          }
          res.status(307).send(user); //Temporary Redirected
        } catch (err) {
          next(err);
        }
      });
    });

  }),
  exports.forgotPassword = async (req, res, next) => {
    console.log(req.body)
    let user = await User.findOne({ email: req.body.email }, 'email firstname');
    console.log(user)
    if (user) {
      let token = jwt.sign({
        exp: Math.floor(Date.now() / 1000) + (60 * 30), //Expires in 30 minute
        data: user
      }, process.env.JWT_SECRET);

      console.log(token)
      try {
        const msg = {
          "to": user.email,
          "from": 'miah.mihrab@gmail.com',
          "subject": 'Password Reset Request',
          "template_id": "d-f08df053220b4ba4a117de314d5fb408",
          "dynamic_template_data": {
            "username": user.firstname,
            "resetLink": `http://localhost:4200/user/reset-password/${token}`
          }
        };
        await sg.send(msg);
        console.log("message sent successfully")
        return res.send({ status: 'success' });
      } catch (err) {
        console.log(err.response.body.errors)
        res.send({ status: 'failed' })
      }
    }
  },
  exports.validateTokenCheck = async (req, res, next) => {
    try {
      let data = jwt.verify(req.body.token, process.env.JWT_SECRET);
      if (data.exp < Date.now() && data.data._id) {
        let user = await User.findOne({ _id: data.data._id }).select('email');
        if (user) {
          return res.send({ status: 'valid', email: user.email });
        } else {
          return res.send({ status: 'invalid' });
        }
      }
    } catch (err) {
      console.log(err)
      return res.send({ status: 'invalid' });
    }


  },
  exports.resetPassword = async (req, res, next) => {
    await bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(req.body.password, 10, async (err, hash) => {
        password = hash;
        try {
          let change = await User.updateOne({ email: req.body.email }, { $set: { password } });
          console.log(change.nModified);
          if (change.nModified === 1)
            return res.send({ status: 'success' });
          return res.send({ status: 'failed' });
        } catch (err) {
          return res.send({ status: 'failed' });
        }
      });
    });

  },

   exports.emailVerification = async (req, res, next) => {
     try {
      let data = jwt.verify(req.body.token, process.env.JWT_SECRET);
        let user = await User.findOne({ _id: data._id }).select('email');
        if (user) {
          await user.updateOne({ emailVerfied: true });
          return res.send({ email: "verified" });
        } else {
          return res.send({ status: false });
        }
    } catch (err) {
      console.log(err)
      return res.send({ status: 'invalid' });
    }

  };;
  