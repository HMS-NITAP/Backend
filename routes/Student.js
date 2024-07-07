const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {studentController} = require('../controllers');
const { auth } = require("../middlewares/auth");

// OUTING APPILICATION APIs
router.post('/createOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.CreateOutingApplication);
router.delete('/deletePendingOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deletePendingOutingApplication);
router.get("/getPendingOutingApplications",authMiddlewares.auth,authMiddlewares.isStudent,studentController.getPendingOutingApplications);
router.get("/getRejectedOutingApplications",authMiddlewares.auth,authMiddlewares.isStudent,studentController.getRejectedOutingApplications);
router.get("/getInProgressOutingApplications",authMiddlewares.auth,authMiddlewares.isStudent,studentController.getInProgressOutingApplications);
router.get("/getCompletedOutingApplications",authMiddlewares.auth,authMiddlewares.isStudent,studentController.getCompletedOutingApplications)

// HOSTEL COMPLAINTS APIs
router.post('/createHostelComplaint',authMiddlewares.auth,authMiddlewares.isStudent,studentController.createHostelComplaint);
router.delete('/deleteHostelComplaint',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deleteHostelComplaint);
router.get('/showAllStudentComplaints',authMiddlewares.auth,authMiddlewares.isStudent,studentController.showAllStudentComplaints);

// MESS FEEDBACK APIs
router.post('/createMessFeedBack',authMiddlewares.auth,authMiddlewares.isStudent,studentController.createMessFeedBack);
router.delete('/deleteMessFeedBack',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deleteMessFeedBack);

// ATTENDENCE APIs
router.get('/getStudentAttendance',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentAttendance);

// DASHBOARD DATA APIs
router.get('/getStudentDashboardData',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentDashboardData);

// PROFILE APIs
router.put('/editProfile',authMiddlewares.auth,authMiddlewares.isStudent,studentController.editProfile);

module.exports = router;