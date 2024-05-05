const express = require("express");
const router = express.Router();

const authRoutes = require("./Auth");
const officialRoutes = require("./Official");
const announcementRoutes = require("./Announcement");

//addition:
const instituteStudentRoutes = require("./instituteStudentRoutes");
const messFeedbackRoutes = require("./messFeedbackRoutes");
const messHallAllotmentRoutes = require("./messHallAllotmentRoutes");
const complaintRoutes = require("./complaintRoutes");

router.use("/auth",authRoutes);
router.use("/official",officialRoutes);
router.use("/announcement",announcementRoutes);

router.use("/complaintRoutes",complaintRoutes);
router.use("./instituteStudentRoutes",instituteStudentRoutes);
router.use("./messFeedbackRoutes",messFeedbackRoutes);
router.use("/messHallAllotmentRoutes",messHallAllotmentRoutes);

module.exports = router;