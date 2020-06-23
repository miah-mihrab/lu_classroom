const User = require("../model/usermodel");
const bcrypt = require("bcrypt");


// USER ACCOUNT INFORMATION
(exports.getAccount = async (req, res, next) => {
  console.log(req.params.id);
  const user = await User.findById(req.params.id);
  await res.send({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    id: user.id,
    department: user.department,
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
      department,
      dob,
      batch,
      semester,
      section,
    } = await req.body;

    let date = dob ? dob.split("-") : null;

    dob = date ? date.join("/") : null;

  console.log(department, "DEPARTMENT")
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
          department,
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
  }),
  (exports.updatePassword = async (req, res, next) => {
    console.log(req.body)

  const user = await User.findOne({ _id: req.params.id })
  
  bcrypt.compare(req.body.old_password, user.password, async (err, resp) => {
      console.log(resp, "RESP")
      if (err) {
        console.log(err)
        return next(err)
      } else {
        try {
          if(resp){
          let hash = await bcrypt.hash(req.body.new_password, 10);
          await user.update({ password: hash }, {new: true});
            return res.send({ message: "Password Updated Successfully" });
          }
          else {
            return res.send({error: "Your old password did not match with current password"})
          }
        } catch (err) { 
          console.log(err)
          return res.send({error: "Something went wrong while updating password"})
        }
      }
    })

  })
  ;
