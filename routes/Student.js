const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {studentController} = require('../controllers');

// OUTING APPILICATION APIs
router.post('/createOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.CreateOutingApplication);
router.get('/getStudentAllOutingApplications',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentAllOutingApplications);
router.delete('/deletePendingOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deletePendingOutingApplication);
router.put('/markReturnOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.markReturnOutingApplication);

// HOSTEL COMPLAINTS APIs
router.post('/createHostelComplaint',authMiddlewares.auth,authMiddlewares.isStudent,studentController.createHostelComplaint);
router.delete('/deleteHostelComplaint',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deleteHostelComplaint);
router.get('/showAllStudentComplaints',authMiddlewares.auth,authMiddlewares.isStudent,studentController.showAllStudentComplaints);

// MESS APIs
router.get('/fetchAllMessHallsAndStudentGender',authMiddlewares.auth,authMiddlewares.isStudent,studentController.fetchAllMessHallsAndStudentGender);
router.post('/createMessFeedBack',authMiddlewares.auth,authMiddlewares.isStudent,studentController.createMessFeedBack);
router.delete('/deleteMessFeedBack',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deleteMessFeedBack);
router.post('/generateMessSessionReceipt',authMiddlewares.auth,authMiddlewares.isStudent,studentController.generateMessSessionReceipt);
router.get('/fetchStudentMessReceipts',authMiddlewares.auth,authMiddlewares.isStudent,studentController.fetchStudentMessReceipts);

// ATTENDENCE APIs
router.get('/getStudentAttendance',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentAttendance);
router.put('/addEvenSemFeeReceipt',authMiddlewares.auth,authMiddlewares.isStudent,studentController.addEvenSemFeeReceipt);

// DASHBOARD DATA APIs
router.get('/getStudentDashboardData',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentDashboardData);

// PROFILE APIs
router.put('/editProfile',authMiddlewares.auth,authMiddlewares.isStudent,studentController.editProfile);

module.exports = router;