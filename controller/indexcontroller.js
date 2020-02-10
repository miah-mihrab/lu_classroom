const _Class = require("../model/classmodel");
const User = require("../model/usermodel");
const jwt = require('jsonwebtoken');
const {
  JWT_SECRET
} = require('../config/secrets');
module.exports = {
  // GET HOME
  async getHome(req, res, next) {
    const userID = req.user._id;
    if (req.user.profession && req.user.profession.trim() === "Student") {
      const UserData = await User.findById(userID);
      if (UserData) {
        let _allClasses = UserData.Classes;
        let classFound = [];
        for (let i = 0; i < _allClasses.length; i++) {
          // FIND THE CLASS
          const findClass = await _Class.findById(_allClasses[i]);

          if (findClass) {
            classFound.push({
              _id: `${findClass._id}`,
              students: findClass.students,
              classname: findClass.classname,
              section: findClass.section,
              subjectname: findClass.subjectname,
              author: findClass.author_name
            });
          }
        }
        if (classFound.length > 0) {
          // CLASS FOUND
          return res.render("profile", {
            allClass: classFound,
            userID: `${userID}`,
            userName: req.user.name
          });
        } else {
          return res.render("profile", {
            title: "Profile",
            userID: `${userID}`,
            userName: req.user.name
          });
        }
      } else {
        // USER NOT FOUND PLEASE LOG IN AGAIN
      }
    } else {
      // IF TEACHER
      const getClasses = await _Class.find();
      if (getClasses.length > 0) {
        // FITER CLASS BY AUTHOR
        let filteredByAuthor = getClasses.filter(
          value => value.author == userID
        );

        if (filteredByAuthor.length > 0) {
          const UserData = await User.findById(
            filteredByAuthor[0].author,
            "firstname lastname"
          );
          let name = `${UserData.firstname} ${UserData.lastname}`;

          let classFound = [];
          filteredByAuthor.forEach(e => {
            classFound.push({
              _id: `${e._id}`,
              students: e.students,
              classname: e.classname,
              section: e.section,
              subjectname: e.subjectname,
              author: name
            });
          });

          if (classFound.length > 0) {
            return res.render("profile", {
              allClass: classFound,
              userID: `${userID}`,
              teacher: true,
              userName: req.user.name
            });
          } else {
            return res.render("profile", {
              userID: `${userID}`,
              teacher: true,
              userName: req.user.name
            });
          }
        }
      } else {
        return res.render("profile", {
          userID: `${userID}`,
          teacher: true,
          userName: req.user.name
        });
      }
    }
  },

  // POST FROM HOME
  async postHome(req, res, next) {
    if (req.body.roomcode) {
      const roomcode = req.body.roomcode;
      _Class.findById(roomcode, (err, _data) => {
        if (!err) {
          User.findById(req.user._id, (err, data) => {
            if (!err) {
              if (!data.Classes.includes(roomcode)) {
                data.Classes.push(roomcode);
                data.save().then(() => {
                  res.redirect("/");
                });
              } else {
                res.redirect("/");
              }
            } else {
              const err = new Error("User may not authorized!");
              err.status = "Unauthorized";
              err.statusCode = 401;
              next(err);
            }
          });
        } else {
          const err = new Error("Room may not available");
          err.status = "Not Found";
          err.statusCode = 404;
          next(err);
        }
      });
    } else {
      const {
        classname,
        section,
        subject
      } = req.body;
      const author = req.user._id;
      try {
        const cls = new _Class({
          classname: classname,
          section: section,
          subjectname: subject,
          author: author,
          author_name: req.user.name
        });
        await cls.save();
        await res.redirect("/");
      } catch {
        const err = new Error("Class not saved");
        err.status = "Database Error";
        err.statusCode = 500;
        next(err);
      }
    }
  },

  // GET RESULT
  async getResult(req, res, next) {
    const id = req.user._id;
    const user = await User.findById(id);
    if (user.id == null || user.dob == null) {
      const err = await new Error("Please provide valid University ID & Date of Birth!");
      err.statusCode = 401;
      err.status = "Unable to fetch!"
      // next(err);
      return next(err);
    } else {
      res.render("result", {
        name: `${user.firstname} ${user.lastname}`,
        id: user.id,
        dob: user.dob,
        userID: req.user._id
      });
    }
  },

  // GET CLASSROOM
  async getClassroom(_req, res) {
    let id = _req.params.id;

    try {
      const _class = await _Class.findById(id);
      const {
        _id,
        students,
        classname,
        section,
        subjectname
      } = _class;
      await res.render("classroom", {
        _id,
        students,
        classname,
        section,
        subjectname
      });
    } catch (err) {
      res.send(err);
    }
  },

  deleteClass(req, res) {
    if (req.user.profession === "Student") {
      User.update({
          _id: req.user._id
        }, {
          $pull: {
            Classes: req.params.id
          }
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            return res.redirect("/");
          }
        }
      );
    } else {
      _Class.findOneAndRemove({
          author: req.user._id
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.redirect("/");
          }
        }
      );
    }
  },

  async getAccount(req, res) {
    const userID = req.user._id;
    const user = await User.findById(userID);
    await res.render("accountInfos", {
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      id: user.id,
      dob: user.dob,
      batch: user.batch,
      section: user.section,
      userID,
      teacher: req.user.profession === "Teacher" ? true : false
    });
  },

  async patchAccount(req, res) {
    const userID = await req.user._id
    let {
      firstname,
      lastname,
      email,
      id,
      dob,
      batch,
      section
    } = req.body;
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
      section,
      dob
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
      await res.clearCookie('jwt');
      await res.cookie("jwt", token);
      //console.log(token);
      return res.status(200).render('accountInfos', {
        title: "Profile",
        firstname,
        lastname,
        email,
        id,
        batch,
        section,
        dob,
        userID,
        teacher: req.user.profession === "Teacher" ? true : false
      });
    }
    //res.status(307).redirect('/'); //Temporary Redirected

  }
};