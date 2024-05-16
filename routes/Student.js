const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {studentController} = require('../controllers');

// OUTING APPILICATION APIs
router.post('/CreateOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.CreateOutingApplication);
router.delete('/deletePendingOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deletePendingOutingApplication);
router.get('/getStudentPendingOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentPendingOutingApplication);
router.get('/getStudentAcceptedOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentAcceptedOutingApplication);
router.get('/getStudentRejectedOutingApplication',authMiddlewares.auth,authMiddlewares.isStudent,studentController.getStudentRejectedOutingApplication);

// HOSTEL COMPLAINTS APIs
router.post('/createHostelComplaint',authMiddlewares.auth,authMiddlewares.isStudent,studentController.createHostelComplaint);
router.delete('/deleteHostelComplaint',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deleteHostelComplaint);
router.get('/showAllStudentComplaints',authMiddlewares.auth,authMiddlewares.isStudent,studentController.showAllStudentComplaints);

// MESS FEEDBACK APIs
router.post('/createMessFeedBack',authMiddlewares.auth,authMiddlewares.isStudent,studentController.createMessFeedBack);
router.delete('/deleteMessFeedBack',authMiddlewares.auth,authMiddlewares.isStudent,studentController.deleteMessFeedBack);

module.exports = router;