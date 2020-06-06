const User = require("../model/usermodel");
const jwt = require("jsonwebtoken");
const cloudinary = require("cloudinary").v2;
const bcrypt = require("bcrypt");

const { JWT_SECRET } = require("../config/secrets");

// USER ACCOUNT INFORMATION
(exports.getAccount = async (req, res, next) => {
  console.log(req.params.id);
  const user = await User.findById(req.params.id);
  await res.send({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    id: user.id,
    dob: user.dob,
    batch: user.batch,
    semester: user.semester,
    section: user.section,
    userPhoto: user.photo ? user.photo.toString("base64") : null,
  });
}),
  // UPDATE ACCOUNT
  (exports.patchAccount = async (req, res, next) => {
    const userID = await req.params.id;
    const UserData = await User.findById(userID);
    let {
      firstname,
      lastname,
      email,
      id,
      dob,
      batch,
      semester,
      section,
    } = await req.body;

    let date = dob ? dob.split("-") : null;
    dob = date ? date.join("/") : null;

    try {
      const user = await User.findByIdAndUpdate(
        {
          _id: userID,
        },
        {
          firstname,
          lastname,
          email,
          id,
          batch,
          semester,
          section,
          dob,
          photo: req.body.photo ? req.body.photo : UserData.photo,
        },
        {
          new: true,
          runValidators: true,
        }
      );
      return res.send({
        success: true,
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          profession: user.profession,
          id: user.id,
          _id: user._id,
          email: user.email,
          batch: user.batch,
          semester: user.semester,
          dob: user.dob,
          photo: user.photo ? user.photo.toString("base64") : null,
          department: user.department,
        },
      });
    } catch (err) {
      return res.send({ success: false });
    }

    // const token = await jwt.sign({
    //         _id: userID,
    //         name: firstname + " " + lastname,
    //         profession: req.user.profession
    //     },
    //     JWT_SECRET
    // );
    // if (token) {
    //     //res.header("x-auth-token", token);
    //     await res.clearCookie("jwt");
    //     await res.cookie("jwt", token);
    //     return res.status(200).redirect(`/account/${req.params.id}`);
    // }
  }),
  (exports.updatePassword = async (req, res, next) => {
    console.log(req.body)

    const user = await User.findOne({ _id: req.params.id })
    // console.log(user)
    bcrypt.compare(req.body.old_password, user.password, async (err, resp) => {
      if (err) {
        console.log(err)
        return res.send({message: "Your old password did not match with current password"})
      } else {
        try {
          let hash = await bcrypt.hash(req.body.new_password, 10);
          await user.update({ password: hash }, {new: true});
          return res.send({ message: "Password Updated Successfully" });
        } catch (err) { 
          console.log(err)
          return res.send({error: "Something went wrong while updating password"})
        }
      }
    })

  })
  ;
