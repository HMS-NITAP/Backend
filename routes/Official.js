const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {officialController} = require('../controllers');

// DASHBOARD APIs
router.get("/getDashboardData",authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getDashboardData);

// ANNOUNCEMENTS APIs
router.post("/createAnnouncement",authMiddlewares.auth,authMiddlewares.isOfficial,officialController.createAnnouncement);

// OUTING APPLICATION APIs
router.get('/getPendingOutingApplicationsByWardenBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getPendingOutingApplicationsByWardenBlock);
router.get('/getCompletedOutingApplicationsByWardenBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getCompletedOutingApplicationsByWardenBlock);
router.get('/getInProgressOutingApplicationsByWardenBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getInProgressOutingApplicationsByWardenBlock);
router.get('/getReturnedOutingApplicationsByWardenBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getReturnedOutingApplicationsByWardenBlock);
router.put('/acceptPendingOutingApplication',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.acceptPendingOutingApplication);
router.put('/rejectPendingOutingApplication',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.rejectPendingOutingApplication);
router.put('/markOutingApplicationCompletedWithoutDelay',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.markOutingApplicationCompletedWithoutDelay);
router.put('/markOutingApplicationCompletedWithDelay',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.markOutingApplicationCompletedWithDelay);

// HOSTEL COMPLAINT APIs
router.get('/getAllUnresolvedComplaintsByHostelBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getAllUnresolvedComplaintsByHostelBlock);
router.get('/getAllResolvedComplaintsByHostelBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getAllResolvedComplaintsByHostelBlock);
router.put('/resolveHostelComplaint',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.resolveHostelComplaint);
router.put('/unresolveHostelComplaint',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.unresolveHostelComplaint);

// ATTEDENCE APIs
router.get('/getAllStudentsByHostelBlockForAttendence',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getAllStudentsByHostelBlockForAttendence);
router.put('/markStudentPresent',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.markStudentPresent);
router.put('/markStudentAbsent',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.markStudentAbsent);
router.put('/unMarkStudentPresent',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.unMarkStudentPresent);
router.put('/unMarkStudentAbsent',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.unMarkStudentAbsent);

// NEW ATTENDANCE APIs
router.get('/fetchAttendanceDataInHostelBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.fetchAttendanceDataInHostelBlock);
module.exports = router;