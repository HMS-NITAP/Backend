const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {studentController} = require('../controllers');

router.post('/CreateOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.CreateOutingApplication);
router.delete('/deletePendingOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deletePendingOutingApplication);
router.get('/getStudentPendingOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentPendingOutingApplication);
router.get('/getStudentAcceptedOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentAcceptedOutingApplication);
router.get('/getStudentRejectedOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentRejectedOutingApplication);


module.exports = router;