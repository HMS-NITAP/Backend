const express = require("express");
const router = express.Router();

const authRoutes = require("./Auth");
const officialRoutes = require("./Official");
const announcementRoutes = require("./Announcement");
const studentRoutes = require("./Student")

router.use("/auth",authRoutes);
router.use("/official",officialRoutes);
router.use("/announcement",announcementRoutes);
router.use("/student",studentRoutes);


module.exports = router;