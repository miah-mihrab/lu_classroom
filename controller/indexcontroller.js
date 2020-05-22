const _Class = require("../model/classmodel");
const _ClassPosts = require("../model/classroommodel");
const Classwork = require("../model/classworkmodel");

const User = require("../model/usermodel");
const Post = require("../model/classroommodel");
const Comment = require("../model/comment");

const moment = require('moment');

const AppError = require("../utils/appError");

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
      const { _id, students, classname, section, subjectname, student } = _class;
      const ClassPosts = await _ClassPosts.find({
        class: classID
      });

      return res.send({
        classID: _id,
        students,
        classname,
        section,
        subjectname,
        student,
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
        author: req.user.name,
        photo: req.body.photo
      });
      return res.send(newComment);
    } else {
      const newPost = await Post.create({
        content: req.body.content,
        class: req.params.id,
        author: req.body.author,
        photo: req.body.photo
      });
      return res.send(newPost);
    }
  }),
  // UPDATE CLASSROOM FOR COMMENTS
  (exports.patchClassroom = async (req, res) => {
    const updatePostWithComment = await Post.findByIdAndUpdate(
      req.body.postID,
      {
        $push: {
          comments: {
            comment: req.body.comment,
            post: req.body.postID,
            author: req.body.author,
            photo: req.body.photo
          }
        }
      },
      {
        new: true
      }
    );
    res.send(updatePostWithComment);
  }),


  (exports.deleteClassPost = async (req, res, next) => {
    await Post.findOneAndDelete({ _id: req.body.postId })
    next(res.status(200))
  }),
  // DELETE CLASS
  (exports.deleteClass = async (req, res, next) => {
  console.log(req.query.user, req.params.id)
  if (req.query.profession === "Student") {
      User.updateOne(
        {
          _id: req.query.user
        },
        {
          $pull: {
            Classes: req.params.id
          }
        },
        (err, data) => {
          console.log(data)
          if (err) {
            return next({ success: false })
          } else {
            return res.send({success: true})
          }
        }
      );
    } else {
      console.log("DELETING")
      _Class.findOneAndRemove(
        {
          _id: req.params.id
        },
        (err, data) => {
          if (err) {
            console.log(err);
          } else {
            res.send(data)
          }
        }
      );
    }
  }),

  (exports.getClassWork = async (req, res, next) => {
    let getClasswork = await Classwork.find({
      classroom: req.params.id
    });
    res.send({

      classID: req.params.id,
      classWorks: getClasswork,
      submittedAssignments: getClasswork.submittedAssignments
    });

  }),

  (exports.postClassWork = async (req, res, next) => {
    // const base64 = req.file
    //   ? await req.user.file.toString("base64")
    // : null;

    if (req.body.profession === "Teacher") {
      const newClasswork = await Classwork.create({
        classroom: req.params.id,
        authorName: req.body.author,
        file: req.file.buffer.toString("base64"),
        fileName: req.file.filename,
        assignmentname: req.body.assignmentname,
        details: req.body.details
      });
      return res.send(newClasswork);
      // res.redirect(`/classroom/${req.params.id}/classwork`);
    } else {
      console.log("STUDENT HERE")
      const getAssignmentId = await Classwork.findOne({
        assignmentname: req.body.assignmentname
      });
      const submitAssignment = {
        details: req.body.details,
        id: req.user.id,
        classroom: req.params.id,
        studentname: req.user.name,
        file: req.file.buffer.toString("base64"),
        fileName: req.file.filename,
        assignmentname: req.body.assignmentname,
        assignmentId: getAssignmentId._id,
        date: moment().format("MMMM Do YYYY, h:mm a")
      };

      const updateClasswork = await Classwork.findOne({
        assignmentname: submitAssignment.assignmentname
      })
      if (updateClasswork.students.includes(req.user._id)) {
        res.json({
          error: "You already submitted the assignment. Please contact with your supervisor if you want to submit again"
        })
      } else {
        await Classwork.findOneAndUpdate(
          {
            assignmentname: submitAssignment.assignmentname
          },
          {
            $push: {
              students: req.user._id,
              submitted: submitAssignment
            }
          },
          {
            new: true,
            runValidators: true
          }
        );
        res.redirect(`/classroom/${req.params.id}/classwork`);

      }
    }
  }),
  (exports.deleteClasswork = async (req, res, next) => {
    await Classwork.findByIdAndDelete({ _id: req.params.id })
  return res.send({
      success: true
    })
  })
