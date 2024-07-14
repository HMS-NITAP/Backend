const express = require("express");
const router = express.Router();

const {commonController} = require('../controllers');

router.get("/getAllAnnouncements",commonController.getAllAnnouncements);
router.get("/fetchAllHostelData",commonController.fetchAllHostelData);
router.get('/fetchCurrentDateRatingsAndReviews',commonController.fetchCurrentDateRatingsAndReviews);
router.get("/fetchHostelBlockNames",commonController.fetchHostelBlockNames);
router.post("/fetchHostelBlockRooms",commonController.fetchHostelBlockRooms);

router.get("/tryPDF",commonController.tryPDF);

// router.get("/getMessRatingAndReview",commonController.getMessRatingAndReview);
// router.get("/getRatingAndReviewOfCurrentDate",commonController.getMessRatingAndReviewOfCurrentDate);
// router.get("/getRatingOfAllMessSessions",commonController.getRatingOfAllMessSessions);

module.exports = router;