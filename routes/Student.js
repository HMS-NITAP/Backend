const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {studentController} = require("../controllers");



router.post("/createStudent",authMiddlewares.auth,authMiddlewares.isStudent,studentController.CreateStudent);


// router.get("/getAllStudent",studentController.getAllStudent);
// router.get("/getStudentById",studentController.getStudentById);
// router.put("/updateStudentById",studentController.updateStudentById);
// router.delete("/deleteStudent",studentController.deleteStudentById);

module.exports = router;