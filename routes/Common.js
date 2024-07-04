const express = require("express");
const router = express.Router();

const {commonController} = require('../controllers');

router.get("/getAllAnnouncements",commonController.getAllAnnouncements);
router.get("/fetchAllHostelData",commonController.fetchAllHostelData);
// router.get("/getMessSessionRatingAndReview/:messHallId/:date/:session",commonController.getMessSessionRatingAndReviews);
// router.get("/getAvgRatingByMessId/:messHallId",commonController.getAvgRatingByMessId);
// router.get("/getAvgRatingRatingOfSession/:session",commonController.getAvgRatingOfSession);
// router.get("/getAllRatingAndReview",commonController.getAllRatingAndReview);

router.get("/getRatingOfAllMessSessions",commonController.getRatingOfAllMessSessions);
router.get("/getRatingAndReviewOfCurrentDate",commonController.getMessRatingAndReviewOfCurrentDate);
router.get("/getMessRatingAndReview",commonController.getMessRatingAndReview);

module.exports = router;