const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {officialController} = require('../controllers');

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

// ATTENDANCE UPDATE
router.put('/updateStudentAttendance',authMiddlewares.auth,authMiddlewares.isOfficial,officialController.updateStudentAttendance);

module.exports = router;