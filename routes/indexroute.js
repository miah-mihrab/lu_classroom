const auth = require("../middleware/authorization");
const express = require("express");
const router = express.Router();
const _Class = require("../model/classmodel");
const User = require("../model/usermodel");

const {
  getHome,
  postHome,
  getResult,
  getEditProfile,
  postEditProfile,
  getClassroom
} = require('../controller/indexcontroller');

router.get("", auth, getHome);

router.post("", auth, postHome);

router.get("/result", auth, getResult);

router.get('/profile-edit/:id', auth, getEditProfile);
router.post('/profile-edit/:id', postEditProfile);

router.get("/classroom/:id", auth, getClassroom);
router.post("/classroom/:id", auth, (req, res) => {
  console.log(req.params)
});
module.exports = router;