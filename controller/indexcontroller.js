const multer = require("multer");
const sharp = require("sharp");

const _Class = require("../model/classmodel");
const _ClassPosts = require("../model/classroommodel");
const User = require("../model/usermodel");
const Post = require("../model/classroommodel");
const Comment = require("../model/comment");

const AppError = require('../utils/appError');


// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `${__dirname}/../public/img/users`);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `${file.originalname}-${Date.now()}.${ext}`);
//   }
// });

const multerStorage = multer.memoryStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload only image", 400), false);
  }
};
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter
});

exports.uploadUserPhoto = upload.single("photo");

exports.resizeUserPhoto = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `${req.file.originalname}-${Date.now()}.jpeg`;
  const buffer = await sharp(req.file.buffer)
    .resize(500, 500)
    .toFormat("jpeg")
    .jpeg({
      quality: 90
    }).toBuffer();
  // .toFile(`${__dirname}/../public/img/users/${req.file.filename}`) //INSIDE FOLDEr
  ;
  req.user.photo = buffer
  next();
};


// GET RESULT
exports.getResult = async (req, res, next) => {
    // const id = req.user._id;
    res.locals.userID = req.user._id;
    const user = await User.findById(req.params.id);
    if (user.id == null || user.dob == null) {
      return next(new AppError('Please provide valid University ID & Date of Birth!', 401));
    } else {
      res.render("result", {
        name: `${user.firstname} ${user.lastname}`,
        id: user.id,
        dob: user.dob,
        userPhoto: user.photo ? user.photo.toString('base64') : null
      });
    }
  },

  // GET ROUTINE
  exports.getRoutine = async (req, res, next) => {
    // const id = req.user._id;
    res.locals.userID = req.user._id;
    const user = await User.findById(req.params.id);
    if (user.department == null || user.batch == null || user.section == null || user.semester == null) {
      return next(new AppError('Please provide valid Department & Semester & Batch & Section if any!', 401));
    } else {
      res.render("routine", {
        name: `${user.firstname} ${user.lastname}`,
        department: user.department,
        batch: user.batch,
        section: user.section,
        semester: user.semester
      });
    }

  }

// GET CLASSROOM
exports.getClassroom = async (_req, res, next) => {
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
      const ClassPosts = await _ClassPosts.find({
        class: id
      });

      // console.log(ClassPosts)
      await res.render("classroom", {
        _id,
        students,
        classname,
        section,
        subjectname,
        ClassPosts
      });
    } catch (err) {
      res.send(err);
    }
  },


  // POST CLASSROOM
  exports.postClassroom = async (req, res) => {
      if (req.body.comment) {
        const newComment = await Comment.create({
          comment: req.body.comment,
          post: req.body.post,
          author: req.user.name
        });
        res.send(newComment);
      } else {
        const newPost = await Post.create({
          content: req.body.content,
          class: req.params.id,
          author: req.user.name
        });
        res.send(newPost);
      }
    },


    // UPDATE CLASSROOM FOR COMMENTS
    exports.patchClassroom = async (req, res) => {
        const updatePostWithComment = await Post.findByIdAndUpdate(
          req.body.post, {
            $push: {
              comments: {
                comment: req.body.comment,
                post: req.body.post,
                author: req.user.name
              }
            }
          }, {
            new: true
          }
        );
        res.send(updatePostWithComment);
      },

      // DELETE CLASS
      exports.deleteClass = async (req, res, next) => {

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
              _id: req.params.id
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
      }