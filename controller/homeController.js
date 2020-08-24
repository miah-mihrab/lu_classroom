const _Class = require("../model/classmodel");
const User = require("../model/usermodel");
const AppError = require("../utils/appError");

// GET HOME
(exports.getHome = async (req, res, next) => {
  res.locals.loading = true;

  let profession = req.query.profession;

  const userID = req.params.id;
  try {
    if (profession.trim() === "Student") {
      const UserData = await User.findById(userID);
    
      if (UserData) {
        let _allClasses = UserData.Classes;
        let classFound = [];
        for (let i = 0; i < _allClasses.length; i++) {
          // FIND THE CLASS
          const findClass = await _Class.findById(_allClasses[i]);

          console.log(findClass)
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
          return res.send({
            allClass: classFound,
            userID: `${userID}`,
            teacher: false,
            emailVerified: UserData.emailVerified,
            userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
          });
        } else {
                
          UserData['photo'] = UserData.photo ? UserData.photo.toString('base64') : null
          return res.send({
            userID: `${userID}`,
            teacher: false,
            emailVerified: UserData.emailVerified,
            photo: UserData.photo ? UserData.photo.toString('base64') : null
          })
          // return res.render("profile", {
          //   title: "Profile",
          //   userID: `${userID}`,
          //   userName: req.user.name,
          //   userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
          // });
        }
      } else {
        // USER NOT FOUND PLEASE LOG IN AGAIN
        next(new AppError("User Not Found. Please Login Again!", 401));
      }
    } else {
      // IF TEACHER
      console.log("TEACHER")
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
            console.log("TEACHER HERE")
          
            return res.send({
              allClass: classFound,
              userID: `${userID}`,
              teacher: true,
              emailVerified: UserData.emailVerified,
              userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
            });
          } else {
            return res.send({
              userID: `${userID}`,
              teacher: true,
              userName: req.user.name,
              emailVerified: UserData.emailVerified,
              userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
            });
          }
        } else {
          const UserData = await User.findById(userID);
          return res.send({
            userID: `${userID}`,
            teacher: true,
            userName: req.user.name,
            emailVerified: UserData.emailVerified,
            userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
          });
        }
      } else {
        const UserData = await User.findById(userID);
        return res.send({
          userID: `${userID}`,
          teacher: true,
          emailVerified: UserData.emailVerified,
          userPhoto: UserData.photo ? UserData.photo.toString("base64") : null
        });
      }
    }
  }catch (err) {
      return res.send(err)
  }
}),
// POST FROM HOME
(exports.postHome = async (req, res, next) => {
  if (req.body.roomcode) {
    const roomcode = req.body.roomcode;
    _Class.findById(roomcode, (err, _data) => {
      if (!err && _data) {
        User.findById(req.body._id, (err, data) => {
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
                return res.send({success: true, class: _data})
              });
            } else {
              console.log("HERE")
              return res.send({success: false, message: "You are already registered to the class"})
            }
          } else {
            return res.status(401).send({ success: false, message: "User may not authorized" });
          }
        });
      } else {
        console.log("NO ROOM")
        res.status(201).send({ success: false, message: 'Room may not available'})
      }
    });


  } else {
    const {
      classname,
      section,
      subject,
      author_name,
      author_id
    } = req.body;
    const author = author_id;
    try {
      const cls = new _Class({
        classname: classname,
        section: section,
        subjectname: subject,
        author: author,
        author_name: author_name
      });
      
      await cls.save();
      return res.send(cls);
      
    } catch {
      next(new AppError("Something went wrong while saving class!", 500));
    }
  }
});
