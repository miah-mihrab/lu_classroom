const express = require("express");
const router = express.Router();
const {
    getSignIn,
    getReg,
    postSignIn,
    postReg

} = require('../controller/authcontroller');



//Get
router.get("/signin", getSignIn);
router.get("/registration", getReg);


//Post
router.post("/signin", postSignIn);
router.post("/registration", postReg);


module.exports = router;