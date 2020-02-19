const multer = require("multer");
const sharp = require("sharp");

const _Class = require("../model/classmodel");
const _ClassPosts = require("../model/classroommodel");
const Classwork = require('../model/classworkmodel');
const AssignmentSubmission = require("../model/assignmentSubmissionModel");

const User = require("../model/usermodel");
const Post = require("../model/classroommodel");
const Comment = require("../model/comment");

const AppError = require("../utils/appError");

// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `${__dirname}/../public/img/users`);
//   },
//   filename: (req, file, cb) => {
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `${file.originalname}-${Date.now()}.${ext}`);
//   }
// });

// const multerStorage = multer.memoryStorage();

// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not an image! Please upload only image", 400), false);
//   }
// };
// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter
// });

// exports.uploadUserPhoto = upload.single("photo");
// exports.resizeUserPhoto = async (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `${req.file.originalname}-${Date.now()}.jpeg`;
//   const buffer = await sharp(req.file.buffer)
//     .resize(500, 500)
//     .toFormat("jpeg")
//     .jpeg({
//       quality: 90
//     })
//     .toBuffer();
//   // .toFile(`${__dirname}/../public/img/users/${req.file.filename}`) //INSIDE FOLDEr
//   req.user.photo = buffer;
//   next();
// };

// // Multer for HOMEWORK FILES
// const homeworkMulterFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("application")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("Not pdf! Please upload only pdf", 400), false);
//   }
// };

// const homeWorkUpload = multer({
//   storage: multerStorage,
//   fileFilter: homeworkMulterFilter
// });

// exports.uploadHomeworkFile = homeWorkUpload.single('file');

// exports.homeWorkFileResize = async (req, res, next) => {
//   if (!req.file) return next();
//   req.file.filename = `${req.file.originalname}-${Date.now()}.pdf`;
//   //console.log(req.file.buffer.toString('base64'))
//   //const buffer = await sharp(req.file.buffer).toBuffer();
//   // .toFile(`${__dirname}/../public/img/users/${req.file.filename}`) //INSIDE FOLDEr
//   req.user.homeWorkFile = await req.file.buffer;
//   next();
// };

// GET RESULT
(exports.getResult = async (req, res, next) => {
  // const id = req.user._id;
  res.locals.userID = req.user._id;
  const user = await User.findById(req.params.id);
  if (user.id == null || user.dob == null) {
    return next(
      new AppError("Please provide valid University ID & Date of Birth!", 401)
    );
  } else {
    res.render("result", {
      name: `${user.firstname} ${user.lastname}`,
      id: user.id,
      dob: user.dob,
      userPhoto: user.photo ? user.photo.toString("base64") : null
    });
  }
}),
// GET ROUTINE
(exports.getRoutine = async (req, res, next) => {
  // const id = req.user._id;
  res.locals.userID = req.user._id;
  const user = await User.findById(req.params.id);
  if (
    user.department == null ||
    user.batch == null ||
    user.section == null ||
    user.semester == null
  ) {
    return next(
      new AppError(
        "Please provide valid Department & Semester & Batch & Section if any!",
        401
      )
    );
  } else {
    res.render("routine", {
      name: `${user.firstname} ${user.lastname}`,
      department: user.department,
      batch: user.batch,
      section: user.section,
      semester: user.semester
    });
  }
}),
// GET CLASSROOM
(exports.getClassroom = async (_req, res, next) => {
  let classID = _req.params.id;

  try {
    const _class = await _Class.findById(classID);
    const {
      _id,
      students,
      classname,
      section,
      subjectname
    } = _class;
    const ClassPosts = await _ClassPosts.find({
      class: classID
    });

    // console.log(ClassPosts)
    await res.render("classroom", {
      classID: _id,
      students,
      classname,
      section,
      subjectname,
      ClassPosts
    });
  } catch (err) {
    res.send(err);
  }
}),
// POST CLASSROOM
(exports.postClassroom = async (req, res) => {
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
}),
// UPDATE CLASSROOM FOR COMMENTS
(exports.patchClassroom = async (req, res) => {
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
}),
// DELETE CLASS
(exports.deleteClass = async (req, res, next) => {
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
}),
(exports.getClassWork = async (req, res, next) => {
  // let base64;
  // base64 = req.user.homeWorkFile ? await req.user.homeWorkFile.toString('base64') : null
  // console.log(req.user.homeWorkFile)
  const getClasswork = await Classwork.find({
    classroom: req.params.id
  });
  res.render("classwork", {
    classID: req.params.id,
    classWorks: getClasswork,
    teacher: req.user.profession === "Teacher" ? true : false
  });
}),
(exports.postClassWork = async (req, res, next) => {

  const base64 = req.user.file ?
    await req.user.file.toString("base64") :
    null;
  if (req.user.profession === "Teacher") {
    const newClasswork = await Classwork.create({

      classroom: req.params.id,
      authorName: req.user.name,
      file: req.file.buffer.toString('base64'),
      fileName: req.file.filename,
      assignmentname: req.body.assignmentname,
      details: req.body.details
    });

    console.log("Classwork sent");
    res.redirect(`/classroom/${req.params.id}/classwork`);
  } else {

    const getAssignmentId = await Classwork.findOne({
      assignmentname: req.body.assignmentname
    });
    console.log("ID: " + req.user.id);
    const submitAssignment = await new AssignmentSubmission({
      details: req.body.details,
      id: req.user.id,
      classroom: req.params.id,
      studentname: req.user.name,
      file: req.file.buffer.toString('base64'),
      fileName: req.file.filename,
      assignmentname: req.body.assignmentname,
      assignmentId: getAssignmentId._id
    });

    const updateClasswork = await Classwork.findOne({
      assignmentname: submitAssignment.assignmentname
    });
    if (updateClasswork.students.includes(req.user._id)) {
      await submitAssignment.save();
      return res.redirect(`/classroom/${req.params.id}/classwork`);
    }
    await Classwork.findOneAndUpdate({
      assignmentname: submitAssignment.assignmentname
    }, {
      $push: {
        students: req.user._id
      }
    }, {
      new: true,
      runValidators: true
    });
    await submitAssignment.save();
    res.redirect(`/classroom/${req.params.id}/classwork`);
  }
}),
(exports.getAssignmentSubmission = async (req, res, next) => {
  const assignment_details = await AssignmentSubmission.find({
    assignmentId: req.params.id
  });

  // const classWork = await Classwork.findById(assignment_details.assignmentId);
  // const assignment_students = [];
  // for (let i = 0; i < classWork.students.length; i++) {
  //   const student = await User.findById(classWork.students[i]).select('firstname lastname id');
  //   assignment_students.push(student);
  // }
  res.render('assignmentSubmission', {
    assignment_details
  });
});