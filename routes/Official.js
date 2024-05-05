const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
// const {officialController} = require('../controllers');

// router.post("/createAnnouncement",authMiddlewares.auth,authMiddlewares.isOfficial,officialController.createAnnouncement);
// router.delete("/deleteAnnouncement",authMiddlewares.auth,authMiddlewares.isOfficial,officialController.deleteAnnouncement);

module.exports = router;