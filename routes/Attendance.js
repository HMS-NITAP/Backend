const express = require("express");
const router = express.Router();

const {attendanceController} = require("../controllers")

router.get("/getAllStudentAttendance",attendanceController.getAllStudentAttendance);
router.get('/getStudentAttendance',attendanceController.getstudentAttendance);
router.get('/getStudentAttendanceByDate',attendanceController.getstudentAttendanceByDate);
router.get("/getAllStudentAttendanceInBlock",attendanceController.getstudentAttendanceByDate);

module.exports = router;