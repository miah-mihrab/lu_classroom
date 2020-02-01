const _Class = require("../model/classmodel");
const User = require("../model/usermodel");

module.exports = {
  // GET HOME
  getHome(req, res) {
    try {
      // IF STUDENT IN COOKIE
      if ((req.user.profession).trim() === "Student") {
        User.findById(req.user._id, async (_err, data) => {
          let _allClasses = data.Classes;
          if (_allClasses) {

            let _allClassesArray = [];
            let _cls = [];
            async function sendClasses(cb) {
              _allClasses.forEach(id => {
                _Class.findById(id, (_err, _class) => {
                  //console.log(_class)
                  if (_class) {
                    let author_id = _class.author[0];
                    //  User.findById(author_id, (_err, teacher) => {
                    //_allClassesArray.push
                    _cls.push({
                      _id: `/classroom/${_class._id}`,
                      students: _class.students,
                      classname: _class.classname,
                      section: _class.section,
                      subjectname: _class.subjectname,
                      author: _class.author_name
                    });
                    //cb(_allClassesArray);
                    // console.log(_allClassesArray)
                    //   });
                  }
                });

              });
            }

            // await sendClasses(allClass => {
            //   _cls.push(allClass);
            //   return;
            // });
            await res.render("profile", {
              allClass: _cls
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
            const teacher = req.user._id;
            let filteredByAuthor = allClass.filter(
              value => value.author == teacher
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
  }
};