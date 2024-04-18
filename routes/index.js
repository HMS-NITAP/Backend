const express = require("express");
const router = express.Router();

const authRoutes = require("./Auth");
const officialRoutes = require("./Official");
const announcementRoutes = require("./Announcement");

router.use("/auth",authRoutes);
router.use("/official",officialRoutes);
router.use("/announcement",announcementRoutes);

module.exports = router;