const express = require("express");
const router = express.Router();

const {commonController} = require('../controllers');

router.get("/getAllAnnouncements",commonController.getAllAnnouncements);
router.get("/fetchAllHostelData",commonController.fetchAllHostelData);

router.get("/getMessRatingAndReview",commonController.getMessRatingAndReview);
router.get("/getRatingAndReviewOfCurrentDate",commonController.getMessRatingAndReviewOfCurrentDate);
router.get("/getRatingOfAllMessSessions",commonController.getRatingOfAllMessSessions);


module.exports = router;