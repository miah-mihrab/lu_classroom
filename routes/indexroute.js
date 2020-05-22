const auth = require("../middleware/authorization");
const express = require("express");
const router = express.Router();


// CONTROLLERS
const indexcontroller = require("../controller/indexcontroller");
const homeController = require('../controller/homeController');
const accountController = require('../controller/accountController');
const fileController = require('../controller/fileController');
// HOME ROUTE
router
  .route("/home")
  .post(homeController.postHome);

router
  .get('/home/:id', homeController.getHome)

// ACCOUNT ROUTE
router
  .route("/profile/:id")
  .get(accountController.getAccount)
  .patch(
    fileController.uploadUserPhoto,
    fileController.resizeUserPhoto,
    accountController.patchAccount)



// CLASSROOM ROUTE
router
  .route("/classroom/:id")
  .get(indexcontroller.getClassroom)
  .post(indexcontroller.postClassroom)
  .patch(indexcontroller.patchClassroom)
  .delete(indexcontroller.deleteClassPost);

// CLASSWORK ROUTE
router
  .route("/classroom/:id/classwork")
  .get(indexcontroller.getClassWork)
  .post(
    fileController.fileUpload,
    fileController.fileMulterResize,
    indexcontroller.postClassWork)
  .delete(indexcontroller.deleteClasswork)
  

router.delete("/delete-class/:id", indexcontroller.deleteClass);
router.get("/result/:id", indexcontroller.getResult);
router.get('/routine/:id', indexcontroller.getRoutine);


module.exports = router;