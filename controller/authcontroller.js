const User = require("../model/usermodel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/appError");

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
});