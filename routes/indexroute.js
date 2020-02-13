const auth = require("../middleware/authorization");
const express = require("express");
const router = express.Router();
const _Class = require("../model/classmodel");
const User = require("../model/usermodel");
const Post = require('../model/classroommodel');
const {
  getHome,
  postHome,
  getResult,
  patchAccount,
  getClassroom,
  deleteClass,
  getAccount,
  postAccount
} = require('../controller/indexcontroller');

// router.get("", auth, getHome);

// router.post("", auth, postHome);

router.route("").get(auth, getHome).post(auth, postHome);

router.get("/result/:id", auth, getResult);

router.get("/classroom/:id", auth, getClassroom);
router.post("/classroom/:id", auth, async (req, res) => {
  const newPost = await Post.create({
    content: req.body.content,
    class: req.params.id
  });
  res.send(newPost);

});
router.get('/delete/:id', auth, deleteClass);



router.get('/account/:id', auth, getAccount);
router.patch('/account/update', auth, patchAccount);

module.exports = router;