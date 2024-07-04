const express = require("express");
const router = express.Router();

const {commonController} = require('../controllers');

router.get("/getAllAnnouncements",commonController.getAllAnnouncements);
router.get("/fetchAllHostelData",commonController.fetchAllHostelData);

router.get("/getRatingOfAllMessSessions",commonController.getRatingOfAllMessSessions);
router.get("/getRatingAndReviewOfCurrentDate",commonController.getMessRatingAndReviewOfCurrentDate);
router.get("/getMessRatingAndReview",commonController.getMessRatingAndReview);

module.exports = router;