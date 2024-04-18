const express = require("express");
const router = express.Router();

const {authMiddlewares} = require("../middlewares");
const {announcementController} = require('../controllers');

router.get("/getAllAnnouncements",authMiddlewares.auth,announcementController.getAllAnnouncements);


module.exports = router;