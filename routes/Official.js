const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {officialController} = require('../controllers');

// DASHBOARD APIs
router.get("/getDashboardData",authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getDashboardData);

// ANNOUNCEMENTS APIs
router.post("/createAnnouncement",authMiddlewares.auth,authMiddlewares.isOfficial,officialController.createAnnouncement);
router.delete("/deleteAnnouncement",authMiddlewares.auth,authMiddlewares.isOfficial,officialController.deleteAnnouncement);

// OUTING APPLICATION APIs
router.get('/getPendingOutingApplicationsByWardenBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getPendingOutingApplicationsByWardenBlock);
router.get('/getAcceptedOutingApplicationsByWardenBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getAcceptedOutingApplicationsByWardenBlock);
router.get('/getRejectedOutingApplicationsByWardenBlock',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.getRejectedOutingApplicationsByWardenBlock);
router.put('/approvePendingOutingApplication',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.approvePendingOutingApplication);
router.put('/rejectPendingOutingApplication',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.rejectPendingOutingApplication);

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