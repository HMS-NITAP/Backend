const express = require("express");
const router = express.Router();

const authRoutes = require("./Auth");
const officialRoutes = require("./Official");
const announcementRoutes = require("./Announcement");
const studentRoutes = require('./Student');
const adminRoutes = require('./Admin');
const commonRoutes = require('./Common');
const attendanceRoutes = require('./Attendance');

router.use("/auth",authRoutes);
router.use("/official",officialRoutes);
router.use("/announcement",announcementRoutes);
router.use("/student",studentRoutes);
router.use("/admin",adminRoutes);
router.use("/common",commonRoutes);
router.use("/attendance",attendanceRoutes);

module.exports = router;