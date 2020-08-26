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
          "from": 'mehrabmehadi@hotmail.com',
          "subject": 'Email verification mail',
          "template_id": "d-dd63ac2aef3b4bb59c0a2c2cfb9d6383",
          "dynamic_template_data": {
            "link": `https://lu-classroom.miah-mihrab.vercel.app/user/verification/${token}`
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
          "template_id": "d-e192d6f0e1c14b51acc140550c9b1928",
          "dynamic_template_data": {
            "username": user.firstname,
            "resetLink": `https://lu-classroom.miah-mihrab.vercel.app/user/reset-password/${token}`
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
       console.log(data)
       let user = await User.findOne({ _id: data._id }).select('email emailVerified');
       console.log(user)
        if (user) {
          await user.updateOne({ emailVerified: true });
          console.log("VERIFIED")
          return res.send({ email: "verified" });
        } else {
          return res.send({ status: false });
        }
    } catch (err) {
      console.log(err)
      return res.send({ status: 'invalid' });
    }

  }
