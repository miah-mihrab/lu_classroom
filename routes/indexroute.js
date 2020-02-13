const AppError = require("../utils/appError");
const auth = require("../middleware/authorization");
const express = require("express");
const router = express.Router();
const _Class = require("../model/classmodel");
const User = require("../model/usermodel");
const Post = require("../model/classroommodel");
const Comment = require("../model/comment");
const path = require("path");

const {
  getHome,
  postHome,
  getResult,
  patchAccount,
  getClassroom,
  deleteClass,
  getAccount,
  postAccount,
  uploadUserPhoto,
  resizeUserPhoto
} = require("../controller/indexcontroller");

// router.get("", auth, getHome);

// router.post("", auth, postHome);

router
  .route("")
  .get(auth, getHome)
  .post(auth, postHome);

router.get("/result/:id", auth, getResult);

router.get("/classroom/:id", auth, getClassroom);
router.post("/classroom/:id", auth, async (req, res) => {
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
});

router.patch("/classroom/:id", auth, async (req, res) => {
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
});

router.get("/delete/:id", auth, deleteClass);

router.get("/account/:id", auth, getAccount);
router.patch("/account/:id", auth, uploadUserPhoto, resizeUserPhoto, patchAccount);

module.exports = router;