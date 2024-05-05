// routes/instituteStudentRoutes.js

const express = require("express");
const router = express.Router();
const { authMiddlewares } = require("../middlewares");
const { instituteStudentController } = require('../controllers');

router.post("/createInstituteStudent", authMiddlewares.auth, instituteStudentController.createInstituteStudent);
router.get("/getInstituteStudent", authMiddlewares.auth, instituteStudentController.getInstituteStudent);
router.put("/updateInstituteStudent", authMiddlewares.auth, instituteStudentController.updateInstituteStudent);
router.delete("/deleteInstituteStudent", authMiddlewares.auth, instituteStudentController.deleteInstituteStudent);

module.exports = router;
