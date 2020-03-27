const _Class = require("../model/classmodel");
const User = require("../model/usermodel");
const AppError = require("../utils/appError");

// GET HOME
(exports.getHome = async (req, res, next) => {
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
            classname: findClass.classname,
            section: findClass.section,
            subjectname: findClass.subjectname,
            author: findClass.author_name,
            student: findClass.student
          });
        }
      }
      if (classFound.length > 0) {
        // CLASS FOUND
        res.locals.teacher = false;
        return res.render("profile", {
          allClass: classFound,
          userID: `${userID}`,
          userName: req.user.name,
          userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
        });
      } else {
        return res.render("profile", {
          title: "Profile",
          userID: `${userID}`,
          userName: req.user.name,
          userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
        });
      }
    } else {
      // USER NOT FOUND PLEASE LOG IN AGAIN
      next(new AppError("User Not Found. Please Login Again!", 401));
    }
  } else {
    // IF TEACHER
    const getClasses = await _Class.find();
    if (getClasses.length > 0) {
      // FITER CLASS BY AUTHOR
      let filteredByAuthor = getClasses.filter(value => value.author == userID);
      if (filteredByAuthor.length > 0) {
        const UserData = await User.findById(userID); //filteredByAuthor[0].author
        let name = `${UserData.firstname} ${UserData.lastname}`;
        let classFound = [];
        filteredByAuthor.forEach(e => {
          classFound.push({
            _id: `${e._id}`,
            classname: e.classname,
            section: e.section,
            subjectname: e.subjectname,
            author: name,
            student: e.student
          });
        });
        if (classFound.length > 0) {
          res.locals.teacher = true;
          return res.render("profile", {
            allClass: classFound,
            userID: `${userID}`,
            teacher: true,
            userName: req.user.name,
            userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
          });
        } else {
          return res.render("profile", {
            userID: `${userID}`,
            teacher: true,
            userName: req.user.name,
            userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
          });
        }
      } else {
        const UserData = await User.findById(req.user._id);
        return res.render("profile", {
          userID: `${userID}`,
          teacher: true,
          userName: req.user.name,
          userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
        });
      }
    } else {
      const UserData = await User.findById(req.user._id);
      return res.render("profile", {
        userID: `${userID}`,
        teacher: true,
        userName: req.user.name,
        userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
      });
    }
  }
}),
// POST FROM HOME
(exports.postHome = async (req, res, next) => {
  if (req.body.roomcode) {
    const roomcode = req.body.roomcode;
    _Class.findById(roomcode, (err, _data) => {
      if (!err) {
        User.findById(req.user._id, (err, data) => {
          if (!err) {
            if (!data.Classes.includes(roomcode)) {
              data.Classes.push(roomcode);
              data.save().then(async () => {
                await _Class.findOneAndUpdate({
                  _id: roomcode
                }, {
                  $push: {
                    student: `${data.firstname} ${data.lastname} (${data.id})`
                  }
                }, {
                  new: true,
                  runValidators: true
                })
                res.redirect("/");
              });
            } else {
              res.redirect("/");
            }
          } else {
            next(new AppError("User may not authorized", 401));
          }
        });
      } else {
        next(new AppError("Room may not available", 404));
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
      const cls = await new _Class({
        classname: classname,
        section: section,
        subjectname: subject,
        author: author,
        author_name: req.user.name
      });
      await cls.save();
      await res.redirect("/");
    } catch {
      next(new AppError("Something went wrong while saving class!", 500));
    }
  }
});