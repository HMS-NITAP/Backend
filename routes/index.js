const express = require("express");
const router = express.Router();

const authRoutes = require("./Auth");
const officialRoutes = require("./Official");
const studentRoutes = require('./Student');
const adminRoutes = require('./Admin');
const commonRoutes = require('./Common');

router.use("/auth",authRoutes);
router.use("/official",officialRoutes);
router.use("/student",studentRoutes);
router.use("/admin",adminRoutes);
router.use("/common",commonRoutes);

module.exports = router;