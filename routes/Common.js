const express = require("express");
const router = express.Router();

const {commonController} = require('../controllers');

router.get("/getAllAnnouncements",commonController.getAllAnnouncements);
router.get("/fetchAllHostelData",commonController.fetchAllHostelData);

module.exports = router;