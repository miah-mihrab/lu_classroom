const _Class = require("../model/classmodel");
const User = require("../model/usermodel");

module.exports = {
  // GET HOME
  getHome(req, res) {
    try {
      // IF STUDENT IN COOKIE
      const userID = req.user._id;
      if ((req.user.profession).trim() === "Student") {
        User.findById(userID, async (_err, data) => {
          let _allClasses = data.Classes;
          if (_allClasses) {

            let _cls = [];
            async function sendClasses(cb) {
              _allClasses.forEach(id => {
                _Class.findById(id, (_err, _class) => {
                  //console.log(_class)
                  if (_class) {
                    let author_id = _class.author[0];
                    //  User.findById(author_id, (_err, teacher) => {
                    //_allClassesArray.push
                    cb({
                      _id: `/classroom/${_class._id}`,
                      students: _class.students,
                      classname: _class.classname,
                      section: _class.section,
                      subjectname: _class.subjectname,
                      author: _class.author_name
                    });
                  }
                });

              });
            }



            await sendClasses(allClass => {
              _cls.push(allClass);

              if (_cls.length === _allClasses.length) {
                console.log(_cls.length)
                res.render("profile", {
                  allClass: _cls,
                  userID: `/profile-edit/${userID}`
                });
              }
            });

          } else {
            res.render("profile", {
              title: "Profile"
            });
          }
        });
      } else {
        // IF TEACHER
        _Class.find({}, (_err, allClass) => {
          if (allClass) {
            //const teacher = req.user._id;
            let filteredByAuthor = allClass.filter(
              value => value.author == userID
            );
            if (filteredByAuthor.length > 0) {
              User.findById(
                filteredByAuthor[0].author,
                "firstname lastname",
                (err, data) => {
                  if (!err) {
                    let name = data.firstname + " " + data.lastname;
                    filteredByAuthor[0].authorname = name;
                    let _allClasses = [];
                    filteredByAuthor.forEach(e => {
                      _allClasses.push({
                        _id: `/classroom/${e._id}`,
                        students: e.students,
                        classname: e.classname,
                        section: e.section,
                        subjectname: e.subjectname,
                        author: name
                      });
                    });
                    res.render("profile", {
                      allClass: _allClasses
                    });
                  } else {
                    res.send(err);
                  }
                }
              );
            } else {
              res.render("profile", {
                title: "Profile"
              });
            }
          }
        });
      }
    } catch (err) {
      throw new Error(err);
    }
  },

  // POST FROM HOME
  async postHome(req, res) {
    if (req.body.roomcode) {
      const roomcode = req.body.roomcode;
      _Class.findById(roomcode, (err, _data) => {
        if (!err) {
          User.findById(req.user._id, (err, data) => {
            if (!err) {
              data.Classes.push(roomcode);
              data.save().then(() => {
                res.redirect("/");
              });
            }
          });
        }
      });
    } else {
      const {
        classname,
        section,
        subject
      } = req.body;
      const author = req.user._id;
      const cls = new _Class({
        classname: classname,
        section: section,
        subjectname: subject,
        author: author,
        author_name: req.user.name
      });
      cls.save().then(() => {
        res.redirect("/");
      });
    }
  },

  // GET RESULT
  getResult(_req, res) {
    res.render("result", {
      id: "1622020026"
    });
  },

  // GET CLASSROOM
  async getClassroom(_req, res) {
    let id = _req.params.id;

    // console.log(id);
    try {
      const _class = await _Class.findById(id);
      const {
        _id,
        students,
        classname,
        section,
        subjectname
      } = _class;
      // console.log(_class)
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


  //GET USER EDIT PROFILE
  getEditProfile(req, res) {
    const user_id = req.user._id;

    User.findById(user_id, (err, user) => {
      if (!err) {
        const {
          firstname,
          lastname,
          dob,
          batch,
          section
        } = user;
        res.render('profile-edit', {
          firstname,
          lastname,
          dob,
          batch,
          section
        });
      }
    })
  },

  async postEditProfile(req, res) {
    console.log(req.body);
  }

};