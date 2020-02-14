const auth = require("../middleware/authorization");
const express = require("express");
const router = express.Router();


// CONTROLLERS
const indexcontroller = require("../controller/indexcontroller");
const homeController = require('../controller/homeController');
const accountController = require('../controller/accountController');

// HOME ROUTE
router
  .route("")
  .get(auth, homeController.getHome)
  .post(auth, homeController.postHome);


// CLASSROOM ROUTE
router
  .route("/classroom/:id")
  .get(auth, indexcontroller.getClassroom)
  .post(auth, indexcontroller.postClassroom)
  .patch(auth, indexcontroller.patchClassroom);

// ACCOUNT ROUTE
router
  .route("/account/:id")
  .get(auth, accountController.getAccount)
  .patch(
    auth,
    indexcontroller.uploadUserPhoto,
    indexcontroller.resizeUserPhoto,
    accountController.patchAccount)



router.get("/delete-class/:id", auth, indexcontroller.deleteClass);
router.get("/result/:id", auth, indexcontroller.getResult);
router.get('/routine/:id', auth, indexcontroller.getRoutine);


module.exports = router;