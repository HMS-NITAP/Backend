const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {studentController} = require('../controllers');

router.get("/getAllApplication",studentController.getAllApplication);
router.post('/createOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.CreateOutingApplication);
router.put('/approveOutingApplication',authMiddlewares.auth,authMiddlewares.isOfficial,studentController.approveOutingApplication);
router.put('/rejectOutingApplication',authMiddlewares.auth,authMiddlewares.isOfficial,studentController.rejectOutingApplication);
router.post('/getStudentAllApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentAllApplication);

module.exports = router;