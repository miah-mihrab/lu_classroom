const auth = require("../middleware/authorization");
const express = require("express");
const router = express.Router();
const _Class = require("../model/classmodel");
const User = require("../model/usermodel");

const {
  getHome,
  postHome,
  getResult,
  getClassroom
} = require('../controller/indexcontroller');

router.get("", auth, getHome);

router.post("", auth, postHome);

router.get("/result", auth, getResult);

router.get("/classroom/:id", auth, getClassroom);
module.exports = router;