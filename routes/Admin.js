const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");

const {authMiddlewares} = require("../middlewares");
const {adminController} = require('../controllers');

const bulkExportLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // limit each admin to 20 bulk exports per window
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => String(req.user?.id ?? "unknown"),
    validate: { keyGeneratorIpFallback: false },
    message: {
        success: false,
        message: "Too many export requests. Please try again after some time.",
    },
});

router.post('/createHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createHostelBlock);
router.delete('/deleteHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteHostelBlock);
router.put('/addWardenToHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.addWardenToHostelBlock);
router.put('/removeWardenFromHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.removeWardenFromHostelBlock);
router.post('/createMessHall',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createMessHall);
router.delete('/deleteMessHall',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteMessHall);
router.post('/createOfficialAccount',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createOfficialAccount);
router.delete('/deleteOfficialAccount',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteOfficialAccount);
router.get('/fetchOfficialAccounts',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchOfficialAccounts);
router.get('/fetchRegistrationApplications',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchRegistrationApplications);
router.put('/acceptRegistrationApplication',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.acceptRegistrationApplication);
router.put('/rejectRegistrationApplication',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.rejectRegistrationApplication);
router.get('/fetchFreezedApplications',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchFreezedApplications);
router.put('/freezeRegistrationApplication',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.freezeRegistrationApplication);
router.put('/confirmFreezedStudentRegistration',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.confirmFreezedStudentRegistration);
router.put('/deleteFreezedStudentApplication',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteFreezedStudentApplication);
router.delete('/deleteAnnouncement',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteAnnouncement);
router.get('/getDashboardData',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.getDashboardData);
router.put('/sendAcknowledgementLetter',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.sendAcknowledgementLetter);
router.post('/fetchRoomsInHostelBlock',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchRoomsInHostelBlock);
router.post('/fetchCotsInRooms',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchCotsInRooms);
router.post('/fetchStudentByRollNoAndRegNo',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchStudentByRollNoAndRegNo);
router.post('/fetchAllStudents',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchAllStudents);
router.post('/fetchStudentAllotmentLetter',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchStudentAllotmentLetter);
router.post('/fetchStudentMessIdCard',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchStudentMessIdCard);
router.post('/exportStudentsXlsxFile',authMiddlewares.auth,authMiddlewares.isAdmin,bulkExportLimiter,adminController.exportStudentsXlsxFile);
router.post('/downloadStudentDetailsInHostelBlockXlsxFile',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.downloadStudentDetailsInHostelBlockXlsxFile);
router.delete('/deleteStudentAccount',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.deleteStudentAccount);
router.post('/fetchCotsForChangeCotOption',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchCotsForChangeCotOption);
router.put('/swapOrExchangeCot',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.swapOrExchangeCot);
router.put('/changeStudentProfilePhoto',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.changeStudentProfilePhoto);
router.get('/fetchEvenSemRegistrationApplications',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchEvenSemRegistrationApplications);
router.put('/acceptEvenSemRegistrationApplication',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.acceptEvenSemRegistrationApplication);
router.put('/rejectEvenSemRegistrationApplication',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.rejectEvenSemRegistrationApplication);
router.put('/sendAcknowledgementLetterEvenSem',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.sendAcknowledgementLetterEvenSem);
router.put('/startEvenSemRegistration', authMiddlewares.auth,authMiddlewares.isAdmin,adminController.startEvenSemRegistration);
router.get('/getPendingComplaints',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.viewPendingComplaints);
router.get("/downloadAllStudentDetailsXlsxFile", authMiddlewares.auth, authMiddlewares.isAdmin, adminController.downloadAllStudentDetailsXlsxFile);
router.put('/editStudentAccount',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.editStudentAccount);
router.post('/createNewStudentFirstYear',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.createNewStudentFirstYear);
router.get('/fetchFirstYearStudentApplications',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.fetchFirstYearStudentApplications);
router.put('/allotRoomForStudentFirstYear',authMiddlewares.auth,authMiddlewares.isAdmin,adminController.allotRoomForStudentFirstYear);

module.exports = router;
