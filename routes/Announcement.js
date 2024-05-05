const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {announcementController} = require('../controllers');

router.get("/getAllAnnouncements",announcementController.getAllAnnouncements);
router.post("/createAnnouncement",authMiddlewares.auth,authMiddlewares.isOfficial,announcementController.createAnnouncement);
router.delete("/deleteAnnocement",authMiddlewares.auth,authMiddlewares.isOfficial,announcementController.deleteAnnouncement);

module.exports = router;