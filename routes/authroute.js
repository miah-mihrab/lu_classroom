const express = require("express");
const router = express.Router();
const {
    getSignIn,
    getReg,
    postSignIn,
    postReg,
    forgotPassword,
    resetPassword,
    validateTokenCheck

} = require('../controller/authcontroller');



//Get
router.get("/signin", getSignIn);
router.get("/registration", getReg);


//Post
router.post("/signin", postSignIn);
router.post("/registration", postReg);
router.post("/forgot-password", forgotPassword);
router.post('/validate-reset-token', validateTokenCheck);
router.patch('/reset-password', resetPassword);
module.exports = router;