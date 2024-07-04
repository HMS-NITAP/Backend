const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {studentController} = require('../controllers');

// OUTING APPILICATION APIs
router.post('/createOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.CreateOutingApplication);
router.delete('/deletePendingOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deletePendingOutingApplication);
router.get('/getStudentAllOutingApplications',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentAllOutingApplications);
router.put('/updateOutingApplicationStatus',authMiddlewares.auth,authMiddlewares.isOfficial,studentController.updateOutingApplicationStatus);
router.post('/markOutingInProgress',authMiddlewares.auth,authMiddlewares.isStudent,studentController.markOutingInProgress);
router.post('/markReturnOuting',authMiddlewares.auth,authMiddlewares.isStudent,studentController.markReturnOuting);

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